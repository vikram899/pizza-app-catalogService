import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be a string"),
    body("description")
        .exists()
        .withMessage("Product description is required")
        .isString()
        .withMessage("Product description should be a string"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("Attributes are required"),
    body("tenantId").exists().withMessage("Tenant id are required"),
    body("categoryId").exists().withMessage("Category Id id are required"),
];
