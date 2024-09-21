import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/auth", authRoutes)

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
