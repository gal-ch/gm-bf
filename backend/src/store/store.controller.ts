import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './entities/store.entity';
import { Public } from 'common/decorators/public.decorator';
import { AuthGuard } from 'auth/jwt-auth.guard';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() store: Store, @Req() req: any): Promise<Store> {
    return this.storeService.create(store, req);
  }

  @Get()
  findAll(@Req() req: any): Promise<Store[]> {
    const accountId = req?.user.sub;
    return this.storeService.findAll(accountId);
  }

  @Public()
  @Post('findAllActive')
  findAllActive(@Body() data: { accountUrl: string }): Promise<Store[]> {
    return this.storeService.findAllActive(data.accountUrl);
  }

  @UseGuards(AuthGuard)
  @Get('getStoresOfOpenedOrders')
  async getStoresOfOpenedOrders(req: any): Promise<Store[]> {
    const accountId = req?.user.sub;
    return await this.storeService.getStoresOfOpenedOrders(accountId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Store> {
    return this.storeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.storeService.remove(+id);
  }


  @Put(':id')
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: CreateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(id, updateStoreDto);
  }

  @Post('closeStoreEndOfDayAndSendEmail')
  async closeStoreEndOfDayAndSendEmail(
    @Body() storesId: number[],
    @Req() req: any,
  ) {
    return this.storeService.closeStoreEndOfDayAndSendEmail(storesId, req);
  }
}
