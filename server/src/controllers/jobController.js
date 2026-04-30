import Application from "../models/Application.js";
import Job from "../models/Job.js";

const mapJobWithCounts = async (job) => {
  const approvedStudents = await Application.countDocuments({
    job: job._id,
    status: "approved"
  });

  return {
    id: job._id,
    providerUserId: job.providerUser,
    title: job.title,
    providerType: job.providerType,
    providerName: job.providerName,
    contactName: job.contactName,
    contactPhone: job.contactPhone,
    contactEmail: job.contactEmail,
    workType: job.workType,
    location: job.location,
    pay: job.pay,
    hours: job.hours,
    positions: job.positions,
    skills: job.skills,
    description: job.description,
    status: job.status,
    approvedStudents,
    createdAt: job.createdAt
  };
};

export const createJob = async (req, res) => {
  const job = await Job.create({
    providerUser: req.user._id,
    title: req.body.title,
    providerType: req.user.providerType,
    providerName: req.user.organizationName || req.user.name,
    contactName: req.user.name,
    contactPhone: req.user.phone,
    contactEmail: req.user.email,
    workType: req.body.workType,
    location: req.body.location,
    pay: req.body.pay,
    hours: req.body.hours,
    positions: req.body.positions,
    skills: req.body.skills,
    description: req.body.description
  });

  res.status(201).json(await mapJobWithCounts(job));
};

export const getProviderJobs = async (req, res) => {
  const jobs = await Job.find({ providerUser: req.user._id }).sort({ createdAt: -1 });
  const payload = await Promise.all(jobs.map(mapJobWithCounts));
  res.json(payload);
};

export const getApprovedJobs = async (_req, res) => {
  const jobs = await Job.find({ status: "approved" }).sort({ createdAt: -1 });
  const payload = await Promise.all(jobs.map(mapJobWithCounts));
  res.json(payload);
};

export const getPendingJobs = async (_req, res) => {
  const jobs = await Job.find({ status: "pending" }).sort({ createdAt: -1 });
  const payload = await Promise.all(jobs.map(mapJobWithCounts));
  res.json(payload);
};

export const updateJobStatus = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found." });
  }

  job.status = req.body.status;
  await job.save();

  res.json(await mapJobWithCounts(job));
};

export const updateProviderJob = async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    providerUser: req.user._id
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found." });
  }

  if (job.status !== "pending") {
    return res.status(400).json({ message: "Only pending jobs can be edited by the provider." });
  }

  Object.assign(job, {
    title: req.body.title,
    workType: req.body.workType,
    location: req.body.location,
    pay: req.body.pay,
    hours: req.body.hours,
    positions: req.body.positions,
    skills: req.body.skills,
    description: req.body.description
  });

  await job.save();

  res.json(await mapJobWithCounts(job));
};

export const deleteProviderJob = async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    providerUser: req.user._id
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found." });
  }

  if (job.status !== "pending") {
    return res.status(400).json({ message: "Only pending jobs can be deleted by the provider." });
  }

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();

  res.json({ message: "Job deleted successfully." });
};

export const getSummaryJobs = async (req, res) => {
  const filter = req.user.role === "provider" ? { providerUser: req.user._id } : {};
  const jobs = await Job.find(filter).sort({ createdAt: -1 });

  const payload = await Promise.all(
    jobs.map(async (job) => {
      const approvedApplications = await Application.find({
        job: job._id,
        status: "approved"
      }).populate("studentUser", "name phone email");

      return {
        ...(await mapJobWithCounts(job)),
        approvedStudentDetails: approvedApplications.map((item) => ({
          id: item.studentUser._id,
          name: item.studentUser.name,
          phone: item.studentUser.phone,
          email: item.studentUser.email
        }))
      };
    })
  );

  res.json(payload);
};
