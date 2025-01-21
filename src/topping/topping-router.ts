import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import toppingValidator from "./topping-validator";
import { ToppingController } from "./topping-controller";
import { asyncWrapper } from "../common/utils/wrapper";
import { S3Storage } from "../common/services/S3Storage";
import { ToppingService } from "./topping-service";

const router = express.Router();

const s3Storage = new S3Storage();
const topppingService = new ToppingService();
const toppingController = new ToppingController(s3Storage, topppingService);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size excedded");
            next(error);
        },
    }),
    toppingValidator,
    asyncWrapper(toppingController.create),
);

router.get("/", asyncWrapper(toppingController.get));

export default router;
