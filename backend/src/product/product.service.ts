import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UploadService } from 'upload/upload.service';
import { AccountService } from 'account/account.service';
import { StoreService } from 'store/store.service';
import { Store } from 'store/entities/store.entity';
import { log } from 'console';
import { Account } from 'account/entities/account.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly uploadService: UploadService,
    private readonly accountService: AccountService,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(accountUrl: string): Promise<Product[]> {
    const account: Account =
      await this.accountService.findAccountByUrl(accountUrl);

    return this.productRepository.find({
      where: {
        account: { id: account.id }, // Properly reference the relation
      },
      relations: ['account'], // Ensure the account relation is loaded if needed
    });
  }

  async create(
    productDto: CreateProductDto,
    file: Express.Multer.File,
    req: any,
  ): Promise<Product> { 
    let imageUrl = '';
    if (file) {
      imageUrl = await this.uploadService.uploadImageToS3(file);
    }
    const account = await this.accountService.findOne(req.user.sub);
    if (!account) throw new UnauthorizedException('Account not found');
    const disabledStoresIds = Array.isArray(productDto.disabledStoresIds)
      ? productDto.disabledStoresIds
      : JSON.parse(productDto?.disabledStoresIds || '[]');

    const product = this.productRepository.create({
      ...productDto,
      image: imageUrl,
      account,
      disabledStoresIds,
      status: Boolean(productDto.status),
    });

    return this.productRepository.save(product);
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async update(
    id: number,
    updateProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    if (file) {
      updateProductDto.image = await this.uploadService.uploadImageToS3(file);
    }
    const disabledStoresIds = Array.isArray(updateProductDto.disabledStoresIds)
      ? updateProductDto.disabledStoresIds
      : JSON.parse(updateProductDto?.disabledStoresIds || '[]');

    Object.assign(product, {
      ...updateProductDto,
      disabledStoresIds,
    });
    return this.productRepository.save(product);
  }
}
