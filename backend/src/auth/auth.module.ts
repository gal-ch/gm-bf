import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'user/user.module'; // Import UserModule here
import { AccountModule } from 'account/account.module'; // Import AccountModule here
import { AccountService } from 'account/account.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2w' },
    }),
    UserModule,
    AccountModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [PassportModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
