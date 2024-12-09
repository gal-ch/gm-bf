import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  private s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  async uploadImageToS3(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}_${originalname}`,
      Body: buffer,
      ContentType: file.mimetype,
    };
    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location; // Return S3 URL
  }
  async getObjectFromS3(key: string): Promise<AWS.S3.GetObjectOutput> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    try {
      const data = await this.s3.getObject(params).promise();
      return data; // Return the object data
    } catch (error) {
      throw new NotFoundException(`Object with key ${key} not found`);
    }
  }
}