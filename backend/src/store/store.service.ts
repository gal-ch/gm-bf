import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { AccountService } from 'account/account.service';
import { Order } from 'order/entities/order.entity';
import { OrderService } from 'order/order.service';
import { MailService } from 'mail/mail.service';
import * as Handlebars from 'handlebars';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private readonly accountService: AccountService,
    private readonly ordersService: OrderService,
    private readonly mailService: MailService,
  ) {}

  async create(storeDto: CreateStoreDto, req: any): Promise<Store> {
    const accountId = req?.user.sub;
    const account = await this.accountService.findOne(accountId);
    const store = this.storeRepository.create({
      ...storeDto,
      account,
    });
    return this.storeRepository.save(store);
  }

  async findAll(id: number): Promise<Store[]> {
    return this.storeRepository.find({where: {account: {id}}});
  }

  async findAllActive(accountUrl: string): Promise<Store[]> {
    const account = await this.accountService.findAccountByUrl(accountUrl);
    
    return this.storeRepository.findBy({
      status: true,
      account: { id: account?.id },
    });  }

  async getStoresOfOpenedOrders(accountId: number): Promise<Store[]> {
    const storesWithActiveOrders = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoin('store.orders', 'order')
      .where('order.open = :open AND order.accountId = :accountId', {
        open: true,
        accountId,
      })
      .distinct(true)
      .getMany();

    return storesWithActiveOrders;
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) throw new NotFoundException(`Store with id ${id} not found`);
    return store;
  }

  async remove(id: number): Promise<void> {
    await this.storeRepository.delete(id);
  }

  async update(id: number, updateStoreDto: CreateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async closeStoreEndOfDayAndSendEmail(distributionPoints: number[], req) {
    try {
      const account = await this.accountService.findOne(req.user.sub);
      const stores = await this.storeRepository.find({
        where: {
          id: In(distributionPoints),
          account: {
            id: account.id,
          },
        },
      });
      await Promise.all(
        stores.map(async (store) => {
          const filters = { distributionPoints: [store.id] };
          const orders = await this.ordersService.findAll({
            storeId: store.id,
            accountId: account.id,
          });

          const filterOpenOrders = orders?.filter((order) => {
            return order.open;
          });

          const startDate = new Date(
            Math.min(
              ...filterOpenOrders?.map((order) =>
                new Date(order.createAt).getTime(),
              ),
            ),
          )?.toISOString();
          const endDate = new Date(
            Math.max(
              ...filterOpenOrders?.map((order) =>
                new Date(order.createAt).getTime(),
              ),
            ),
          )?.toISOString();

          const report = await this.ordersService.getAllOrderByStore(
            startDate,
            endDate,
            filters,
            account.id,
          );
          const tableReportExcel = await this.ordersService.exportReport(
            startDate,
            endDate,
            filters,
            account.id,
            store.id,
          );

          await this.mailService.sendOrderConfirmation({
            account,
            email: store.managerEmail || account.email,
            subject: `${store.name} טבלת הזמנות עבור`,
            template: 'store-report',
            context: {
              storeName: store.name,
              startDate: new Date(startDate).toLocaleDateString(),
              endDate: new Date(endDate).toLocaleDateString(),
              report,
            },
            attachments: tableReportExcel,
            html: this.generateOrdersTableHtml(
              store.manager,
              store.name,
              store.day,
            ),
          });
        }),
      );

      this.ordersService.setAsCompleted(distributionPoints, req);
    } catch (e) {
      console.error('Error closing store and sending emails:', e);
    }
  }

  generateOrdersTableHtml(
    managerName: string,
    storeName: string,
    day: string,
  ): string {
    const source = `
    <div dir="rtl">
      <h3>שלום {{managerName}}</h3>
      <div style="display: flex; flex-direction: row;">
          <p> מצורפת טבלת ההזמנות עבור</p> 
          <p>{{storeName}}</p>
      </div>
      <div style="display: flex; flex-direction: row;">
          <p> עבור יום</p>
          <p>{{day}}</p>
      </div>
    </div>
    `;

    const template = Handlebars.compile(source);
    return template({ managerName, storeName, day });
  }
}
