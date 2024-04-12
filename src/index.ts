import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {CLIENT_URL, PORT} from "./config/envirenmentVariables";
import sequelize from "./database";
import authRouter from "./routes/auth-routes";
import addressRouter from "./routes/address-route";
import productRouter from "./routes/product-route";
import categoryRouter from "./routes/category-route";
import sizeRouter from "./routes/size-route";
import colorRouter from "./routes/color-route";
import favoriteProductsRouter from "./routes/favorite-products-route";
import cartItemsRouter from "./routes/cart-item-router";
import webhookRouter from "./routes/webhook-route";
import subscriptionRouter from "./routes/subscriptions-route";
import errorMiddleware from "./middlewares/error-middleware";

const app: Express = express();

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));
app.use(cookieParser());

app.use("/webhook/", webhookRouter);

app.use(express.json());

app.use("/public/", express.static("public"));
app.use("/auth/", authRouter);
app.use("/addresses/", addressRouter);
app.use("/products/", productRouter);
app.use("/categories/", categoryRouter);
app.use("/sizes/", sizeRouter);
app.use("/colors/", colorRouter);
app.use("/favorite-products/",favoriteProductsRouter);
app.use("/cart-items/", cartItemsRouter);
app.use("/subscriptions/", subscriptionRouter);
app.use(errorMiddleware);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        app.listen(PORT, () => {
            console.log(`Server starts: ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

startServer();
