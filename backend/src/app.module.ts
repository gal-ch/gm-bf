import {
  Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Order } from './order/entities/order.entity';
import { Product } from './product/entities/product.entity';
import { Account } from './account/entities/account.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { OrderController } from './order/order.controller';
import { ProductController } from './product/product.controller';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { ProductService } from './product/product.service';
import { OrderService } from './order/order.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Store } from 'store/entities/store.entity';
import { StoreController } from 'store/store.controller';
import { StoreService } from 'store/store.service';
import { UploadService } from 'upload/upload.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'auth/auth.service';
import { MailService } from './mail/mail.service';
import { StoreModule } from 'store/store.module';
import { OrderModule } from 'order/order.module';
import { AccountModule } from 'account/account.module';
import { MailModule } from 'mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from 'payment/payment.service';
@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1w' },
        global: true,
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        debug: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Product, Account, Order, Store],
      logging: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },

    }),
    TypeOrmModule.forFeature([User, Product, Account, Store, Order]),

    AuthModule,
    StoreModule,
    OrderModule,
    AccountModule,
    MailModule,
  ],
  controllers: [
    AccountController,
    ProductController,
    OrderController,
    UserController,
    StoreController,
  ],
  providers: [
    AccountService,
    ProductService,
    OrderService,
    UserService,
    StoreService,
    UploadService,
    JwtService,
    AuthService,
    MailService,
    PaymentService,
  ],

})


export class AppModule { }

