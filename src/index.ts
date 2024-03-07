import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/envirenmentVariables";
import sequelize from "./database";
import authRouter from "./routes/auth-routes";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth/", authRouter);

sequelize.sync().then(() => {
    console.log("Connect to DB");
    app.listen(PORT, () => {
        console.log(`Server starts: ${PORT}`);    
    });
}).catch(() => {
    console.log("Can't connect to DB");
});