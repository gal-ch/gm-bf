import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]), // Register the repository
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    UploadService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AccountService],
})
export class AccountModule {}
