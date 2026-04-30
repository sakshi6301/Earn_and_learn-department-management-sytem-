export function filterJobs(items, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    [item.title, item.providerName, item.location, item.status, item.workType]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery))
  );
}

export function filterSummaryJobs(items, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    [item.title, item.providerName, item.location, item.status, item.approvedStudentDetails?.map((student) => student.name).join(", ")]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery))
  );
}

export function filterApplications(items, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    [
      item.status,
      item.job?.title,
      item.job?.providerName,
      item.job?.location,
      item.student?.name,
      item.student?.course,
      item.student?.residence
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery))
  );
}

export function withinDateRange(value, from, to) {
  const current = new Date(value);
  if (from) {
    const fromDate = new Date(from);
    if (current < fromDate) return false;
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    if (current > toDate) return false;
  }
  return true;
}
