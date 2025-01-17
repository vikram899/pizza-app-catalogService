import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import {
    Attribute,
    Filter,
    PriceConfiguration,
    Product,
} from "./product-types";
import { FileData, FileStorage } from "../common/types/storage";
import { v4 as uuidV4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        //Image from form data
        const imageData = req.files!.image as UploadedFile;

        const imageName = uuidV4();

        await this.storage.upload({
            filename: imageName,
            fileData: imageData.data,
        } as FileData);

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body as Product;

        let parsedPriceConfiguration: PriceConfiguration | undefined;
        if (typeof priceConfiguration === "string") {
            parsedPriceConfiguration = JSON.parse(
                priceConfiguration,
            ) as PriceConfiguration;
        }

        let parsedAttributes: Attribute[] | undefined;
        if (typeof attributes === "string") {
            parsedAttributes = JSON.parse(attributes) as Attribute[];
        }
        const newProduct = await this.productService.create({
            name,
            description,
            priceConfiguration: parsedPriceConfiguration,
            attributes: parsedAttributes,
            tenantId,
            categoryId,
            image: imageName,
            isPublish,
        } as Product);

        res.json({ id: newProduct._id });
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { productId } = req.params;
        let imageName: string | undefined;
        //Image from form data
        if (req.files?.image) {
            const oldImage =
                await this.productService.getProductImage(productId);

            //upload image
            const imageData = req.files.image as UploadedFile;

            imageName = uuidV4();

            await this.storage.upload({
                filename: imageName,
                fileData: imageData.data,
            } as FileData);

            await this.storage.delete(oldImage!);
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body as Product;

        let parsedPriceConfiguration: PriceConfiguration | undefined;
        if (typeof priceConfiguration === "string") {
            parsedPriceConfiguration = JSON.parse(
                priceConfiguration,
            ) as PriceConfiguration;
        }

        let parsedAttributes: Attribute[] | undefined;
        if (typeof attributes === "string") {
            parsedAttributes = JSON.parse(attributes) as Attribute[];
        }

        const updatedData = await this.productService.update(productId, {
            name,
            description,
            priceConfiguration: parsedPriceConfiguration,
            attributes: parsedAttributes,
            tenantId,
            categoryId,
            image: imageName,
            isPublish,
        } as Product);

        res.json({ id: updatedData?._id });
    };

    getAll = async (req: Request, res: Response) => {
        const { q, tenantId, categoryId, isPublish } = req.query;

        const filters: Filter = {};

        if (isPublish === "true") filters.isPublish = true;

        if (tenantId) filters.tenantId = tenantId as string;

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }

        const products = await this.productService.getAll(q as string, filters);

        res.json(products);
    };
}
