import mongoose from "mongoose";
import { PriceConfiguration } from "../category/category-types";

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "additional"],
        required: true,
    },
    availableOptions: {
        type: Map,
        of: Number,
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<PriceConfiguration>({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: "string",
            required: true,
        },
        description: {
            type: "string",
            reuired: true,
        },
        image: {
            type: "string",
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
            required: true,
        },
        attributes: [attributeSchema],
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        isPublish: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Product", productSchema);
