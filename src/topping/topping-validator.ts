import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Topping name is required")
        .isString()
        .withMessage("Topping name should be a string"),
    body("price")
        .exists()
        .withMessage("Topping description is required")
        .isNumeric()
        .withMessage("Topping description should be a number"),
    body("tenantId").exists().withMessage("Tenant id are required"),
    body("image").custom((value, { req }) => {
        if (!req.files) throw new Error("Topping image is required");
        return true;
    }),
];
