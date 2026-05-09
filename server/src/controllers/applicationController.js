import Application from "../models/Application.js";
import Job from "../models/Job.js";

const ASSIGNED_APPLICATION_STATUSES = ["approved", "completed"];
const ALLOWED_STATUS_TRANSITIONS = {
  pending: ["approved", "rejected"],
  approved: ["completed"],
  rejected: [],
  completed: []
};

const mapApplication = (application) => ({
  id: application._id,
  status: application.status,
  createdAt: application.createdAt,
  approvedAt: application.approvedAt,
  completedAt: application.completedAt,
  job: application.job
    ? {
        id: application.job._id,
        title: application.job.title,
        providerName: application.job.providerName,
        location: application.job.location,
        pay: application.job.pay,
        hours: application.job.hours,
        workType: application.job.workType,
        positions: application.job.positions,
        status: application.job.status
      }
    : null,
  student: application.studentUser
    ? {
        id: application.studentUser._id,
        name: application.studentUser.name,
        phone: application.studentUser.phone,
        email: application.studentUser.email,
        course: application.studentUser.course,
        residence: application.studentUser.residence,
        skills: application.studentUser.skills,
        availability: application.studentUser.availability
      }
    : null
});

const countAssignedApplications = (jobId, excludeApplicationId) => {
  const filter = {
    job: jobId,
    status: { $in: ASSIGNED_APPLICATION_STATUSES }
  };

  if (excludeApplicationId) {
    filter._id = { $ne: excludeApplicationId };
  }

  return Application.countDocuments(filter);
};

export const applyForJob = async (req, res) => {
  const job = await Job.findById(req.body.jobId);
  if (!job || job.status !== "approved") {
    return res.status(400).json({ message: "This job is not open for applications." });
  }

  const existingApplication = await Application.findOne({
    job: job._id,
    studentUser: req.user._id
  });

  if (existingApplication) {
    return res.status(400).json({ message: "You have already applied for this work opportunity." });
  }

  const assignedCount = await countAssignedApplications(job._id);
  if (assignedCount >= job.positions) {
    return res.status(400).json({ message: "This work opportunity is already filled." });
  }

  let application;
  try {
    application = await Application.create({
      job: job._id,
      studentUser: req.user._id
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: "You have already applied for this work opportunity." });
    }
    throw error;
  }

  await application.populate("job");
  await application.populate("studentUser", "name phone email course residence skills availability");

  res.status(201).json(mapApplication(application));
};

export const getMyApplications = async (req, res) => {
  const applications = await Application.find({ studentUser: req.user._id })
    .populate("job")
    .populate("studentUser", "name phone email course residence skills availability")
    .sort({ createdAt: -1 });

  res.json(applications.map(mapApplication));
};

export const getPendingApplications = async (_req, res) => {
  const applications = await Application.find({ status: "pending" })
    .populate("job")
    .populate("studentUser", "name phone email course residence skills availability")
    .sort({ createdAt: -1 });

  res.json(applications.map(mapApplication));
};

export const getAllApplications = async (_req, res) => {
  const applications = await Application.find()
    .populate("job")
    .populate("studentUser", "name phone email course residence skills availability")
    .sort({ createdAt: -1 });

  res.json(applications.map(mapApplication));
};

export const updateApplicationStatus = async (req, res) => {
  const nextStatus = req.body.status;
  const application = await Application.findById(req.params.id)
    .populate("job")
    .populate("studentUser", "name phone email course residence skills availability");

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[application.status] || [];
  if (!allowedNextStatuses.includes(nextStatus)) {
    return res.status(400).json({
      message: `Application cannot move from ${application.status} to ${nextStatus}.`
    });
  }

  if (!application.job || application.job.status !== "approved") {
    return res.status(400).json({ message: "This application is no longer linked to an approved job." });
  }

  if (nextStatus === "approved") {
    const assignedCount = await countAssignedApplications(application.job._id, application._id);
    if (assignedCount >= application.job.positions) {
      return res.status(400).json({ message: "All seats for this work opportunity are already filled." });
    }

    application.approvedAt = new Date();
    application.completedAt = undefined;
  }

  if (nextStatus === "rejected") {
    application.approvedAt = undefined;
    application.completedAt = undefined;
  }

  if (nextStatus === "completed") {
    application.completedAt = new Date();
    if (!application.approvedAt) {
      application.approvedAt = application.updatedAt || new Date();
    }
  }

  application.status = nextStatus;
  await application.save();

  res.json(mapApplication(application));
};

export const withdrawApplication = async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    studentUser: req.user._id
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  if (application.status !== "pending") {
    return res.status(400).json({ message: "Only pending applications can be withdrawn." });
  }

  await application.deleteOne();

  res.json({ message: "Application withdrawn successfully." });
};
