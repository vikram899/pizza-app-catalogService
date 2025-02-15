import mongoose from "mongoose";

export interface Product {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
    tenantId: string;
    categoryId: string;
    image: string;
    isPublish: boolean;
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: Record<string, number>;
    };
}

export interface Attribute {
    name: string;
    value: string | boolean;
}

export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublish?: boolean;
}

export interface PaginateQuery {
    page: number;
    limit: number;
}
