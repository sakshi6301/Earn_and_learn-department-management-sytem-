import Application from "../models/Application.js";
import Job from "../models/Job.js";

const mapApplication = (application) => ({
  id: application._id,
  status: application.status,
  createdAt: application.createdAt,
  job: application.job
    ? {
        id: application.job._id,
        title: application.job.title,
        providerName: application.job.providerName,
        location: application.job.location,
        pay: application.job.pay,
        hours: application.job.hours,
        workType: application.job.workType
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

export const applyForJob = async (req, res) => {
  const job = await Job.findById(req.body.jobId);
  if (!job || job.status !== "approved") {
    return res.status(400).json({ message: "This job is not open for applications." });
  }

  const approvedCount = await Application.countDocuments({
    job: job._id,
    status: "approved"
  });

  if (approvedCount >= job.positions) {
    return res.status(400).json({ message: "This work opportunity is already filled." });
  }

  const application = await Application.create({
    job: job._id,
    studentUser: req.user._id
  });

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

export const updateApplicationStatus = async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("job")
    .populate("studentUser", "name phone email course residence skills availability");

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  application.status = req.body.status;
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
