import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { AccountModule } from 'account/account.module';
import { MailModule } from 'mail/mail.module';
import { HttpModule } from '@nestjs/axios';
import { Account } from 'account/entities/account.entity';
import { Store } from 'store/entities/store.entity';
import { PaymentModule } from 'payment/payment.module';
import { PaymentService } from 'payment/payment.service';
import { StoreModule } from 'store/store.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Account]),
    AccountModule,
    MailModule,
    PaymentModule,
  ],
  providers: [
    OrderService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ], // Ensure OrderService is provided here
  controllers: [OrderController],
  exports: [OrderService], // Make sure to export it for use in other modules
})
export class OrderModule {}
