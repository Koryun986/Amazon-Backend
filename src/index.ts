import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config/envirenmentVariables";
import sequelize from "./database";
import authRouter from "./routes/auth-routes";
import addressRouter from "./routes/address-route";

const app: Express = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth/", authRouter);
app.use("/addresses/", addressRouter);

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