// src/config/app.js
import express from "express";
import dotenv from "dotenv";

dotenv.config(); // load .env only once

export const app = express();
export const router = express.Router();
