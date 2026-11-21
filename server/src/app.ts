import express from "express";
import cors from "cors";
import articleRoutes from "./Routes/articleRoutes.js";
import adminRoutes from './Routes/adminRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/articles", articleRoutes);
app.use('/admins', adminRoutes);
