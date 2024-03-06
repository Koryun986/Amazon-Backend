import express, { Express } from "express";
import cors from "cors";
//@ts-ignore
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(cors({
    origin: "*",
}));

app.listen(PORT, () => {
    console.log(`Server starts: ${PORT}`);
    
});