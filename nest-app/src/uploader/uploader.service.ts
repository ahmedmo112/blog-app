import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { v4 as uuid4 } from "uuid";

@Injectable()
export class UploaderService {
    private client: S3Client;
    private bucketName: string = process.env.AWS_BUCKET_NAME;


    constructor() {
        const s3_region = process.env.AWS_REGION;
        if (!s3_region) {
            throw new Error('AWS_REGION is required');
        }
        this.client = new S3Client({
            region: s3_region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            forcePathStyle: true
        });
    }
    async uploadFile(file: Express.Multer.File) {
       try {
        const key = `${uuid4()}`;
        const command = new PutObjectCommand(
            {
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentLength: file.size,
                Metadata:{
                    originalName: file.originalname
                }
            }
        );

        const uploadResult = await this.client.send(command);

        return {
            key,
            url: (await this.getFileUrl(key)).url
        }
       } catch (error) {
            throw new InternalServerErrorException(error);
       }
    }
    async getFileUrl(key: string) {
        return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
    }
}