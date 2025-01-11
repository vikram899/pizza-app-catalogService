import CatagoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CatagoryModel(category);
        return newCategory.save();
    }
}
