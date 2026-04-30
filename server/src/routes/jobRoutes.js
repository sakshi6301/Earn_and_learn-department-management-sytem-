import express from "express";

import {
  createJob,
  deleteProviderJob,
  getApprovedJobs,
  getPendingJobs,
  getProviderJobs,
  getSummaryJobs,
  updateProviderJob,
  updateJobStatus
} from "../controllers/jobController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/approved", protect, authorize("student"), getApprovedJobs);
router.get("/pending", protect, authorize("head"), getPendingJobs);
router.get("/mine", protect, authorize("provider"), getProviderJobs);
router.get("/summary", protect, authorize("provider", "head"), getSummaryJobs);
router.post("/", protect, authorize("provider"), createJob);
router.patch("/:id", protect, authorize("provider"), updateProviderJob);
router.delete("/:id", protect, authorize("provider"), deleteProviderJob);
router.patch("/:id/status", protect, authorize("head"), updateJobStatus);

export default router;
