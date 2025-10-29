import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Read environment variables with safe defaults
const { NODE_ENV = "dev", FRONTEND_URL = "http://localhost:3000" } =
  process.env;
// CORS configuration based on environment
const corsOptions =
  NODE_ENV === "dev"
    ? { origin: true, credentials: true }
    : { origin: FRONTEND_URL, credentials: true };

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS with environment-specific configuration
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});
// Mount API routes (index aggregates subroutes, e.g. /auth)
app.use("/api/v1", routes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(NODE_ENV === "dev" && { error: err.message, stack: err.stack }),
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Note: the centralized error handler above will format all errors. Keep this final middleware
// only as a last-resort fallback (it should not normally be reached).

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
