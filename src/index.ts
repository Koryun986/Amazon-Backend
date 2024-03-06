import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/envirenmentVariables";

const app: Express = express();

app.use(cors({
    origin: "*",
}));

app.listen(PORT, () => {
    console.log(`Server starts: ${PORT}`);    
});