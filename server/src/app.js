import cors from "cors";
import express from "express";

import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();

// =========================
// ✅ MIDDLEWARE
// =========================
app.use(express.json());

// =========================
// ✅ CORS CONFIG (PRODUCTION SAFE)
// =========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://earn-learn-client.onrender.com"
    ],
    credentials: true
  })
);

// =========================
// ✅ BASIC TEST ROUTES
// =========================
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy 🚀"
  });
});

// =========================
// ✅ API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// =========================
// ❌ ERROR HANDLING MIDDLEWARE
// =========================
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong"
  });
});

export default app;