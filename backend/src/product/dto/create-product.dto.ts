import { Account } from 'account/entities/account.entity';
import { IsString, IsDecimal, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';
import { isBoolean } from 'validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  price: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  status: boolean;

  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  disabledStoresIds?: number[];

  description: string

}
