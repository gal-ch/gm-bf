// import {
//   Controller,
//   Post,
//   UseInterceptors,
//   UploadedFile,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { UploadService } from './upload.service';

// @Controller('upload')
// export class UploadController {
//   constructor(private readonly imageUploadService: UploadService) {}

//   @Post('image')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadImage(@UploadedFile() file: Express.Multer.File) {
//     const imageUrl = await this.imageUploadService.uploadImageToS3(file);
//     return { imageUrl };
//   }
// }