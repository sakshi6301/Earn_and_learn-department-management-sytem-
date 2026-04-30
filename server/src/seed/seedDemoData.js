import bcrypt from "bcryptjs";

import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

const seedDemoData = async () => {
  const existingHead = await User.findOne({ email: "head@samiti.org" });
  if (existingHead) {
    return;
  }

  const hashedHead = await bcrypt.hash("head123", 10);
  const hashedProvider = await bcrypt.hash("provider123", 10);
  const hashedStudent = await bcrypt.hash("student123", 10);

  const [head, provider, student] = await User.create([
    {
      name: "Aarti Joshi",
      email: "head@samiti.org",
      password: hashedHead,
      phone: "+91 9876500001",
      role: "head",
      department: "Earn & Learn Department"
    },
    {
      name: "Meera Kulkarni",
      email: "provider@trust.org",
      password: hashedProvider,
      phone: "+91 9988776655",
      role: "provider",
      organizationName: "Shikshan Vikas Trust",
      providerType: "Organization",
      officeLocation: "Pune"
    },
    {
      name: "Rahul Shinde",
      email: "student@college.edu",
      password: hashedStudent,
      phone: "+91 9000000000",
      role: "student",
      course: "BCom, 2nd Year",
      residence: "Samiti Hostel A",
      skills: "Typing, Excel, catalog support",
      availability: "Evenings, 3 hours"
    }
  ]);

  const [approvedJob, pendingJob] = await Job.create([
    {
      providerUser: provider._id,
      title: "Library Records Digitization",
      providerType: "Organization",
      providerName: "Shikshan Vikas Trust",
      contactName: provider.name,
      contactPhone: provider.phone,
      contactEmail: provider.email,
      workType: "On-site",
      location: "Pune",
      pay: 650,
      hours: "3 hours per day for 10 days",
      positions: 6,
      skills: "Typing, basic computer knowledge",
      description: "Students help scan and organize old library records for the college archive.",
      status: "approved"
    },
    {
      providerUser: provider._id,
      title: "Community Survey Support",
      providerType: "Organization",
      providerName: "Shikshan Vikas Trust",
      contactName: provider.name,
      contactPhone: provider.phone,
      contactEmail: provider.email,
      workType: "Hybrid",
      location: "Nashik",
      pay: 800,
      hours: "Weekends, 5 hours",
      positions: 4,
      skills: "Communication, Marathi",
      description: "Support field survey work and related data entry for a social development project.",
      status: "pending"
    }
  ]);

  await Application.create({
    job: approvedJob._id,
    studentUser: student._id,
    status: "approved"
  });

  console.log(`Seeded demo data for ${head.email}, ${provider.email}, and ${student.email}`);
  console.log(`Pending sample job: ${pendingJob.title}`);
};

export default seedDemoData;
