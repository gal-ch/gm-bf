import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'common/decorators/public.decorator';
import { AuthGuard } from 'auth/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Post()
  async findAll(@Body() params: any,){
    const a = this.productService.findAll(params.accountUrl);
    console.log(a);
    
    return a
  }
  
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('createProduct')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {    
    return this.productService.create(createProductDto, file, req);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {    
    
    return this.productService.update(id, updateProductDto, file);
  }

}
