import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  details: {
    productName: string;
    amount: number;
    price: number;
  }[];

  @IsNotEmpty()
  @IsString()
  client: string;

  @IsNotEmpty()
  @IsString()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  clientPhoneNumber: string;

  @IsNotEmpty()
  store: number;

  // @IsNotEmpty()
  // creditCardNumber: string;

  // @IsNotEmpty()
  // creditCardCvv: string;

  // @IsNotEmpty()
  // creditCardExpiration: string;

  @IsNotEmpty()
  citizenID: string


}
