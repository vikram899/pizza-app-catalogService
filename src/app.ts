import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";
import cookieParser from "cookie-parser";
import toppingRouter from "./topping/topping-router";
import config from "config";
import cors from "cors";

const app = express();
const adminDashboard: string = config.get<string>("ADMIN_DASHBOARD_URL");

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cors({
        origin: [adminDashboard],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.json();
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/toppings", toppingRouter);

app.use(globalErrorHandler);

export default app;
