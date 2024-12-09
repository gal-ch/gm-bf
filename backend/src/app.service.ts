import { Account } from './account/entities/account.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    // Inject other repositories if needed
  ) {}
async onModuleInit() { 
await this.accountRepository.clear();}
 getHello(): string {
    return 'Hello World!';
  }
}