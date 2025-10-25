require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3000;
// CORS configuration based on environment
const corsOptions =
  NODE_ENV === "dev"
    ? { origin: true, credentials: true } // Allow all origins in development
    : { origin: FRONTEND_URL, credentials: true }; // Restrict to FRONTEND_URL in production

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS with environment-specific configuration
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Simple health check
app.get("/", (req, res) =>
  res.json({ message: "Server is up. Use /api/auth to register/login." })
);

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
app.use("/api", routes);

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

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
