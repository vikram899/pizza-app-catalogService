import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;

        // calll the servie
        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });
        this.logger.info(`Created category`, { id: category._id });
        res.json({ id: category._id });
    }

    async getAll(req: Request, res: Response) {
        // calll the servie
        const categories: Category[] = await this.categoryService.getAll();
        this.logger.info(`Getting categories list`);
        res.json(categories);
    }

    async getById(req: Request, res: Response) {
        // calll the servie
        const { _id } = req.params;

        const categories: Category[] = await this.categoryService.getById(_id);
        this.logger.info(`Getting category with id ${_id}`);
        res.json({ category: categories[0] });
    }

    async delete(req: Request, res: Response) {
        // calll the servie
        const { _id } = req.params;

        await this.categoryService.delete(_id);
        this.logger.info(`Getting categories list`);
        res.json({});
    }
}
