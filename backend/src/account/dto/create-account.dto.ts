import { IsString, IsDecimal, IsNotEmpty, IsOptional, IsEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsEmpty()
  setting: JSON;
  
  headImg: string;
}