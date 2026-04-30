import express from "express";

import {
  applyForJob,
  getMyApplications,
  getPendingApplications,
  updateApplicationStatus,
  withdrawApplication
} from "../controllers/applicationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("student"), applyForJob);
router.get("/mine", protect, authorize("student"), getMyApplications);
router.get("/pending", protect, authorize("head"), getPendingApplications);
router.delete("/:id", protect, authorize("student"), withdrawApplication);
router.patch("/:id/status", protect, authorize("head"), updateApplicationStatus);

export default router;
