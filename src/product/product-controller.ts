import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Attribute, PriceConfiguration, Product } from "./product-types";
import { FileData, FileStorage } from "../common/types/storage";
import { v4 as uuidV4 } from "uuid";
import { UploadedFile } from "express-fileupload";

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
}
