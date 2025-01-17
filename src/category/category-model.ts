import mongoose from "mongoose";
import { PriceConfiguration, Category } from "./category-types";

const attributeSchema = new mongoose.Schema<PriceConfiguration>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        enum: ["switch", "radio"],
        required: true,
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ["base", "additional"],
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const categorySchema = new mongoose.Schema<Category>(
    {
        name: {
            type: "string",
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
            required: true,
        },
        attributes: {
            type: [attributeSchema],
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
