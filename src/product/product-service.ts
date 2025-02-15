import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, PaginateQuery, Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        return (await productModel.create(product)) as Product;
    }

    async getProductImage(productId: string) {
        const product = (await productModel.findById({
            _id: productId,
        })) as Product;
        return product?.image;
    }
    async update(productId: string, product: Product) {
        return (await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $set: product,
            },
            {
                new: true,
            },
        )) as Product;
    }

    async getAll(q: string, filter: Filter, paginateQuery: PaginateQuery) {
        const searchQuery = new RegExp(q, "i");

        const matchQuery = {
            ...filter,
            name: searchQuery,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                                description: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        });
    }
    async get(id: string) {
        const product: Product | null = await productModel.findOne({ _id: id });
        return product;
    }
    async delete(id: string) {
        return await productModel.deleteOne({ _id: id });
    }
}
