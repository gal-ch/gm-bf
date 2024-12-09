import { Module } from '@nestjs/common';
//import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { PaymentService } from './payment.service'; 

@Module({
 // imports: [HttpModule],  // Add HttpModule here
  providers: [PaymentService],
  exports: [PaymentService],  // If other modules need to use PaymentService
})
export class PaymentModule {}
