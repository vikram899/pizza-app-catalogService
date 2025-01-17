import CatagoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CatagoryModel(category);
        return newCategory.save();
    }
    async getAll() {
        return await CatagoryModel.find();
    }
    async getById(_id: string) {
        return await CatagoryModel.find({ _id });
    }
    async delete(_id: string) {
        return await CatagoryModel.deleteOne({ _id });
    }
}
