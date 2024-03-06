import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/envirenmentVariables";
import sequelize from "./database";

const app: Express = express();

app.use(cors({
    origin: "*",
}));

app.use(express.json());

sequelize.sync().then(() => {
    console.log("Connect to DB");
    app.listen(PORT, () => {
        console.log(`Server starts: ${PORT}`);    
    });
}).catch(() => {
    console.log("Can't connect to DB");
});