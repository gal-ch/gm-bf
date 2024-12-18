import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { createExcel } from 'utils/excel-utils';
import dayjs from 'dayjs';
import { AccountService } from 'account/account.service';
import { PaymentService } from 'payment/payment.service';
import { MailService } from 'mail/mail.service';
import * as Handlebars from 'handlebars';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly accountService: AccountService,
    private paymentService: PaymentService,
    private readonly mailService: MailService,
  ) { }

  async create(orderDetails, cardDetails) {
    try {
      const [expirationMonth, expirationYear] = cardDetails.creditCardExpiration
        .split('/')
        .map((x) => x.trim());
      const account = await this.accountService.findAccountByUrl(
        orderDetails.accountUrl,
      );
      if (!account) {
        throw new NotFoundException(`account not found`);
      }
      const itemsArray = orderDetails.details?.map((item) => {
        return {
          Item: {
            Name: item.productName,
            Price: item.price,
          },
          Quantity: item.amount,
          UnitPrice: item.price,
          Total: item.amount * item.price,
        };
      });

      const paymentData = {
        Customer: {
          Name: orderDetails.client,
          EmailAddress: orderDetails.clientEmail,
        },
        PaymentMethod: {
          CreditCard_Number: cardDetails.creditCardNumber,
          CreditCard_ExpirationMonth: expirationMonth,
          CreditCard_ExpirationYear: expirationYear,
          CreditCard_CVV: cardDetails.creditCardCvv,
          CreditCard_CitizenID: cardDetails.citizenID,
          Type: 1,
        },
        Items: itemsArray,
        SendDocumentByEmail: true,
        VATIncluded: true,
        Credentials: {
          CompanyID: account.creditCompanyId || 571524266,
          APIKey: account.creditApiKey || process.env.SUMIT_API_KEY,
        },
      };
      const paymentResponse =
        await this.paymentService.makePayment(paymentData);

      // if (paymentResponse.status !== 'success') {
      //   throw new HttpException('Payment failed', 400);
      // }
      const order = this.orderRepository.create({
        details: orderDetails.details,
        store: orderDetails.store.id,
        account: account,
        client: orderDetails.clientName,
        clientEmail: orderDetails.clientEmail,
        clientPhoneNumber: orderDetails.clientPhoneNumber,
        open: true,
      });

      await this.orderRepository.save(order);
      let totalPrice = 0;
      orderDetails.details?.forEach((item) => {
        totalPrice += item.price * item.amount;
        item.total = item.amount * item.price;
      });

      const htmlContent = this.getOrderConfirmationHtml(
        orderDetails.clientName,
        orderDetails.details,
        totalPrice,
      );
      await this.mailService.sendOrderConfirmation({
        account,
        email: orderDetails.clientEmail,
        subject: 'הזמנה חדשה',
        template: 'order-confirmation',
        html: htmlContent,
      });
      return paymentResponse;
    } catch (e) {
      console.log(e);
    }
  }

  getOrderConfirmationHtml(clientName: string, details, totalPrice) {
    const source = `
<h3>ההזמנה שלך אושרה!</h3>
<p>תודה שקנית אצלנו, {{clientName}}.</p>
<p>מצורף פירוט המוצרים:</p>
<table style="width: 100%; border-collapse: collapse; text-align: right;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">סך הכל (ILS)</th>
      <th style="border: 1px solid #ddd; padding: 8px;">כמות</th>
      <th style="border: 1px solid #ddd; padding: 8px;">מחיר ליחידה (ILS)</th>
      <th style="border: 1px solid #ddd; padding: 8px;">שם המוצר</th>

    </tr>
  </thead>
  <tbody>
    {{#each details}}
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">{{this.total}}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">{{this.amount}}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">{{this.price}}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">{{this.productName}}</td>

    </tr>
    {{/each}}
  </tbody>
</table>
<p><strong>סך הכל:</strong> {{totalPrice}} ILS</p>
    `;

    const template = Handlebars.compile(source);
    return template({ clientName, details, totalPrice });
  }

  async findAll({
    storeId,
    startDate,
    endDate,
    filters,
    accountId,
    open,
  }: {
    storeId?: number;
    startDate?: string;
    endDate?: string;
    filters?: Record<string, number[]>;
    accountId: number;
    open?: boolean;
  }): Promise<Order[]> {
    const queryOptions: any = { relations: ['store', 'account'] };

    if (storeId) {
      queryOptions.where = { store: { id: storeId } };
    }
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf('day').toDate();
      const end = dayjs(endDate).endOf('day').toDate();
      queryOptions.where = {
        ...queryOptions.where,
        createAt: Between(start, end),
      };
    }
    // Apply distribution points filter if provided
    if (filters?.distributionPoints && filters.distributionPoints.length) {
      queryOptions.where = {
        ...queryOptions.where,
        store: In(filters.distributionPoints),
      };
    }
    // Apply account filter if provided
    if (accountId) {
      queryOptions.where = {
        ...queryOptions.where,
        account: { id: accountId },
      };
    }
    const orders = await this.orderRepository.find(queryOptions);
    const filteredOrders =
      filters?.products && filters.products.length
        ? orders.filter((order) =>
          order.details.some((detail) =>
            filters.products.includes(detail.productId),
          ),
        )
        : orders;

    return filteredOrders;
  }

  async exportReport(
    startDate: string,
    endDate: string,
    filters: Record<string, number[]>,
    req: any,
    storeId?: number,
  ) {
    try {
      const orders = await this.findAll({
        storeId,
        startDate,
        endDate,
        filters,
        accountId: req.user.sub,
      });
      const reportData = storeId
        ? this.getStoreReport(orders)
        : this.getCollectionReport(orders);
      return await createExcel(reportData, 'Orders Report');
    } catch (error) {
      console.error('Error generating Excel file: ', error);
    }
  }

  getCollectionReport = (orders: Order[]) => {
    try {
      const tables = [];
      const columnDefinition = [
        { value: 'productName', label: 'שם מוצר', name: 'productName' },
        { value: 'amount', label: 'כמות', name: 'amount' },
      ];
      const productPickupMap: { [productName: string]: number } = {};
      orders.forEach((order) => {
        order.details.forEach((detail) => {
          if (productPickupMap[detail.productName]) {
            productPickupMap[detail.productName] += detail.amount;
          } else {
            productPickupMap[detail.productName] = detail.amount;
          }
        });
      });
      const rows = Object.entries(productPickupMap).map(
        ([productName, amount]) => {
          return {
            productName,
            amount,
          };
        },
      );
      tables.push({
        detailsTable: {
          columnDefinition,
          rows,
        },
      });
      return tables;
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  getStoreReport = (orders: Order[]) => {
    const tables = [];
    try {
      const productNames = Array.from(
        new Set(
          orders
            .map((order) => order.details.map((product) => product.productName))
            .flat(),
        ),
      );
      const columnDefinition = [
        { value: 'client', label: 'לקוח', name: 'client' },
        { value: 'phone', label: 'טלפון', name: 'phone' },
      ];

      const productsColumns = productNames.map((productName) => {
        return { value: productName, label: productName, name: productName };
      });
      columnDefinition.push(...productsColumns, {
        value: 'total',
        label: 'סה"כ',
        name: 'total',
      });
      const rows = orders.map((order) => {
        let total = 0;
        const products = order.details.reduce((acc, product) => {
          acc[product.productName] = product.amount;
          total += acc[product.productName] * product.price;
          return acc;
        }, {});
        return {
          client: order.client,
          phone: order.clientPhoneNumber,
          ...products,
          total,
        };
      });
      tables.push({
        detailsTable: {
          columnDefinition,
          rows,
        },
      });
    } catch (e) {
      console.error(e);
    }

    return tables;
  };

  async setAsCompleted(distributionPoints: number[], req) {
    try {
      const filters = { distributionPoints };
      const account = await this.accountService.findOne(req.accountId || 1);
      const orders = await this.findAll({ filters, accountId: account.id });
      orders.forEach((order) => {
        order.open = false;
      });
      await this.orderRepository.save(orders);
    } catch (e) {
      console.error('Error setting orders');
    }
  }

  async getAllOrderByStore(
    startDate: string,
    endDate: string,
    filters: Record<string, number[]>,
    accountId: number,
  ) {
    const allOrders = await this.findAll({
      startDate,
      endDate,
      filters,
      accountId,
    });
    const ordersByStores = allOrders.reduce(
      (acc, order) => {
        const storeId = order.store.id;
        if (storeId) {
          if (!acc[storeId]) {
            acc[storeId] = [];
          }
          acc[storeId].push(order);
        }
        return acc;
      },
      {} as Record<number, Order[]>,
    );
    return ordersByStores;
  }
}
