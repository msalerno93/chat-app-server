import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import connectToMongoDB from "./db/connectToDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server running on port ${PORT}`);
})
