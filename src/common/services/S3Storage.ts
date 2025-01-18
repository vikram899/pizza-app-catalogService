import { FileData, FileStorage } from "../types/storage";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import config from "config";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("s3.region"),
            credentials: {
                accessKeyId: config.get("s3.accessKeyId"),
                secretAccessKey: config.get("s3.secretAccessKey"),
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const bucketName = config.get("s3.bucket");

        if (typeof bucketName !== "string") {
            throw new Error("S3 bucket name is not properly configured");
        }

        const objectParams = {
            Bucket: bucketName,
            Key: data.filename,
            Body: Buffer.from(data.fileData),
        };

        await this.client.send(new PutObjectCommand(objectParams));
    }

    async delete(filename: string): Promise<void> {
        const bucketName = config.get("s3.bucket");

        if (typeof bucketName !== "string") {
            throw new Error("S3 bucket name is not properly configured");
        }

        const objectParams = {
            Bucket: bucketName,
            Key: filename,
        };

        await this.client.send(new DeleteObjectCommand(objectParams));
    }

    getObjectUri(filename: string): string {
        const bucket: string = config.get("s3.bucket");
        const region: string = config.get("s3.region");
        return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
    }
}
