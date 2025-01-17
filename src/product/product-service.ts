import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        return await productModel.create(product);
    }

    async getProductImage(productId: string) {
        const product = await productModel.findById({ _id: productId });
        return product?.image;
    }
    async update(productId: string, product: Product) {
        return await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $set: product,
            },
            {
                new: true,
            },
        );
    }
}
