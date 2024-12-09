//import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor()
   // private readonly httpService: HttpService) 
   {}

  async makePayment(paymentData: any): Promise<any> {
    const url = 'https://api.sumit.co.il/billing/payments/charge';
    try {
  //    const response = await this.httpService.post(url, paymentData).toPromise();
   ///   return response.data;
    } catch (error) {
      throw new Error(`Payment failed: ${error}`);
    }
  }
}
