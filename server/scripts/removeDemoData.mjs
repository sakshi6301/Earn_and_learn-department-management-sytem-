import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const demoEmails = ["head@samiti.org", "provider@trust.org", "student@college.edu"];

async function removeDemoData() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const User = mongoose.model(
    "User",
    new mongoose.Schema({}, { strict: false, collection: "users" })
  );
  const Job = mongoose.model(
    "Job",
    new mongoose.Schema({}, { strict: false, collection: "jobs" })
  );
  const Application = mongoose.model(
    "Application",
    new mongoose.Schema({}, { strict: false, collection: "applications" })
  );

  const users = await User.find({ email: { $in: demoEmails } }).select("_id email");
  const userIds = users.map((user) => user._id);

  const jobs = await Job.find({
    $or: [{ providerUser: { $in: userIds } }, { contactEmail: { $in: demoEmails } }]
  }).select("_id");
  const jobIds = jobs.map((job) => job._id);

  const applicationResult = await Application.deleteMany({
    $or: [{ job: { $in: jobIds } }, { studentUser: { $in: userIds } }]
  });
  const jobResult = await Job.deleteMany({ _id: { $in: jobIds } });
  const userResult = await User.deleteMany({ _id: { $in: userIds } });

  console.log(
    JSON.stringify(
      {
        removedApplications: applicationResult.deletedCount,
        removedJobs: jobResult.deletedCount,
        removedUsers: userResult.deletedCount
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

removeDemoData().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
