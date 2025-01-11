import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json();
});

app.use("/categories", categoryRouter);

app.use(globalErrorHandler);

export default app;
