import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: '*', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'], // Include the 'Authorization' header
  credentials: true, // Allow cookies or other credentials
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  // app.setGlobalPrefix('back-office', {
  //   exclude: [{ path: 'app', method: RequestMethod.ALL }],
  // });
  // app.setGlobalPrefix('app');

  await app.listen(3002, '0.0.0.0');
}
bootstrap();
