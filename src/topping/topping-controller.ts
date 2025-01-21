import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { FileData } from "../common/types/storage";
import { S3Storage } from "../common/services/S3Storage";
import { v4 as uuidV4 } from "uuid";
import { ToppingService } from "./topping-service";
import { CreateRequestBody, Topping } from "./topping-types";

export class ToppingController {
    constructor(
        private storage: S3Storage,
        private toppingService: ToppingService,
    ) {}

    create = async (
        req: Request<object, object, CreateRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const imageData = req.files!.image as UploadedFile;
        const imageName = uuidV4();

        await this.storage.upload({
            filename: imageName,
            fileData: imageData.data,
        } as FileData);

        const savedTopping = await this.toppingService.create({
            ...req.body,
            image: imageName,
        } as Topping);

        res.json(savedTopping);
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const toppings = await this.toppingService.getAll(
                req.query.tenantId as string,
            );

            const readyToppings = toppings.map((topping) => {
                return {
                    id: topping._id,
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectUri(topping.image),
                };
            });
            res.json(readyToppings);
        } catch (err) {
            return next(err);
        }
    };
}
