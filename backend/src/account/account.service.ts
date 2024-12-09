import { NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { UploadService } from 'upload/upload.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private readonly uploadService: UploadService,
  ) {}

  create(email: string, password: string) {
    const account = this.accountRepository.create({ email, password });
    return this.accountRepository.save(account);
  }

  async findPartialOneByUrl(accountUrl: string): Promise<Partial<Account>> {
    const account = await this.accountRepository.findOneBy({
      siteUrl: accountUrl,
    });
    return {
      id: account.id,
      settings: account.settings,
      siteUrl: account.siteUrl,
      email: account.email,
      headImg: account.headImg,
    };
  }

  async findAccountByUrl(accountUrl: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({
      siteUrl: accountUrl,
    });

    return account
  }

  async findOne(id: number): Promise<Account> {
    
    return this.accountRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return await this.accountRepository.findOneBy({ email });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
    file?: Express.Multer.File,
  ): Promise<Account> {    
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException(`account with id ${id} not found`);
    }
    if (file) {
      updateAccountDto.headImg = await this.uploadService.uploadImageToS3(file);
    }
    Object.assign(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}