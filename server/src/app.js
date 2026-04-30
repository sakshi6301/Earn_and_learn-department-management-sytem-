import cors from "cors";
import express from "express";

import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();

// ✅ FIXED CORS (added deployed frontend URL)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://earn-and-learn-department-management-2nwq.onrender.com"
    ],
    credentials: true
  })
);

app.use(express.json());

// ✅ Optional: root route (to avoid "Cannot GET /")
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Health check route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// ✅ Your routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ✅ Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Something went wrong."
  });
});

export default app;