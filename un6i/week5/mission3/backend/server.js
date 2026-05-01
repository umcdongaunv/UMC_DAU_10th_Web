import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

app.use("/", authRouter);

app.listen(8000, () => {
  console.log("server running on 8000");
});