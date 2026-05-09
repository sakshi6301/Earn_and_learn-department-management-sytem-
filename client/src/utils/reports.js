const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

export function buildStudentMetrics(applications) {
  const completedApplications = applications.filter((application) => application.status === "completed");
  const activeApplications = applications.filter((application) => ["pending", "approved"].includes(application.status));
  const currentMonthKey = getMonthKey(new Date());

  const totalEarnings = completedApplications.reduce((sum, application) => sum + getApplicationPay(application), 0);
  const monthlyEarnings = completedApplications
    .filter((application) => getMonthKey(application.completedAt) === currentMonthKey)
    .reduce((sum, application) => sum + getApplicationPay(application), 0);

  return {
    activeApplications: activeApplications.length,
    completedCount: completedApplications.length,
    monthlyEarnings,
    totalEarnings
  };
}

export function buildStudentMonthlyRows(applications) {
  const grouped = completedApplicationsByMonth(applications);

  return grouped.map((item) => ({
    ...item,
    jobs: item.jobs.sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))
  }));
}

export function buildHeadStudentRecords(applications) {
  const records = new Map();
  const currentMonthKey = getMonthKey(new Date());

  applications.forEach((application) => {
    const student = application.student;
    if (!student?.id) return;

    const existing = records.get(student.id) || {
      id: student.id,
      name: student.name,
      course: student.course || "Not set",
      residence: student.residence || "Not set",
      totalApplications: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      completedCount: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
      lastCompletedAt: null
    };

    existing.totalApplications += 1;
    if (application.status === "pending") existing.pendingCount += 1;
    if (application.status === "approved") existing.approvedCount += 1;
    if (application.status === "rejected") existing.rejectedCount += 1;

    if (application.status === "completed") {
      const pay = getApplicationPay(application);
      existing.completedCount += 1;
      existing.totalEarnings += pay;

      if (getMonthKey(application.completedAt) === currentMonthKey) {
        existing.monthlyEarnings += pay;
      }

      if (!existing.lastCompletedAt || new Date(application.completedAt) > new Date(existing.lastCompletedAt)) {
        existing.lastCompletedAt = application.completedAt;
      }
    }

    records.set(student.id, existing);
  });

  return Array.from(records.values()).sort((left, right) => {
    if (right.totalEarnings !== left.totalEarnings) {
      return right.totalEarnings - left.totalEarnings;
    }

    return left.name.localeCompare(right.name);
  });
}

export function buildHeadMonthlyReport(applications) {
  return completedApplicationsByMonth(applications).map((item) => ({
    id: item.id,
    label: item.label,
    totalEarnings: item.totalEarnings,
    completedCount: item.jobs.length,
    studentCount: item.studentIds.size,
    providerCount: item.providerNames.size
  }));
}

function completedApplicationsByMonth(applications) {
  const grouped = new Map();

  applications
    .filter((application) => application.status === "completed" && application.completedAt)
    .forEach((application) => {
      const key = getMonthKey(application.completedAt);
      const existing = grouped.get(key) || {
        id: key,
        label: formatMonthLabel(application.completedAt),
        totalEarnings: 0,
        jobs: [],
        studentIds: new Set(),
        providerNames: new Set()
      };

      existing.totalEarnings += getApplicationPay(application);
      existing.jobs.push({
        id: application.id,
        title: application.job?.title || "Untitled work",
        providerName: application.job?.providerName || "Unknown provider",
        completedAt: application.completedAt,
        pay: getApplicationPay(application)
      });

      if (application.student?.id) {
        existing.studentIds.add(application.student.id);
      }

      if (application.job?.providerName) {
        existing.providerNames.add(application.job.providerName);
      }

      grouped.set(key, existing);
    });

  return Array.from(grouped.values()).sort((left, right) => right.id.localeCompare(left.id));
}

function getApplicationPay(application) {
  return Number(application.job?.pay) || 0;
}

function getMonthKey(value) {
  if (!value) return "";
  const current = new Date(value);
  const year = current.getFullYear();
  const month = String(current.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
}
