import { useMemo, useState } from "react";

import DashboardShell from "../components/common/DashboardShell";
import Field from "../components/common/Field";
import FilterBar from "../components/common/FilterBar";
import Modal from "../components/common/Modal";
import PasswordPanel from "../components/common/PasswordPanel";
import StatusBadge from "../components/common/StatusBadge";
import TableCard from "../components/common/TableCard";
import { formatCurrency } from "../utils/reports";

function HeadDashboard({
  changePasswordForm,
  errors,
  filteredApplications,
  filteredJobs,
  filteredSummaryJobs,
  filters,
  headMonthlyReport,
  headStudentRecords,
  message,
  onApplyFilter,
  onChangePasswordForm,
  onChangePasswordSubmit,
  onLogout,
  onProfileFormChange,
  onProfileSubmit,
  onRefresh,
  onUpdateApplicationStatus,
  onUpdateJobStatus,
  profileForm,
  stats,
  user
}) {
  const [activeSection, setActiveSection] = useState("jobs");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { id: "jobs", label: "Job Queue", note: "Approve or reject provider jobs" },
      { id: "applications", label: "Applications", note: "Review student applicants" },
      { id: "summary", label: "Reports", note: "Student earnings and records" },
      { id: "profile", label: "Profile", note: "Department ownership details" },
      { id: "security", label: "Security", note: "Password management" }
    ],
    []
  );

  return (
    <DashboardShell
      activeSection={activeSection}
      message={message}
      navItems={navItems}
      onLogout={onLogout}
      onRefresh={onRefresh}
      onSectionChange={setActiveSection}
      stats={stats}
      subtitle="Manage approval queues with searchable tables, role visibility, and stronger workflow control."
      title="Department Head Dashboard"
      user={user}
    >
      {activeSection === "jobs" ? (
        <section className="panel panel-stack">
          <div className="panel-heading">
            <div>
              <h2>Job Review Queue</h2>
              <p className="section-note">Filter all provider jobs by status, provider, or date before taking action.</p>
            </div>
          </div>
          <HeadJobFilters filters={filters} onApplyFilter={onApplyFilter} />
          <TableCard
            columns={["Title", "Provider", "Location", "Status", "Created", "Actions"]}
            emptyMessage="No jobs match the current filters."
            rows={filteredJobs.map((job) => [
              <td key="title">{job.title}</td>,
              <td key="provider">{job.providerName}</td>,
              <td key="location">{job.location}</td>,
              <td key="status"><StatusBadge status={job.status} /></td>,
              <td key="created">{formatDate(job.createdAt)}</td>,
              <td key="actions">
                {job.status === "pending" ? (
                  <div className="table-actions">
                    <button className="primary-button compact-button" onClick={() => onUpdateJobStatus(job.id, "approved")} type="button">
                      Approve
                    </button>
                    <button className="danger-button compact-button" onClick={() => onUpdateJobStatus(job.id, "rejected")} type="button">
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="helper-text">Reviewed</span>
                )}
              </td>
            ])}
          />
        </section>
      ) : null}

      {activeSection === "applications" ? (
        <section className="panel panel-stack">
          <div className="panel-heading">
            <div>
              <h2>Student Application Queue</h2>
              <p className="section-note">Review current applications, then mark approved work as completed when it is done.</p>
            </div>
          </div>
          <HeadApplicationFilters filters={filters} onApplyFilter={onApplyFilter} />
          <TableCard
            columns={["Student", "Course", "Job", "Provider", "Status", "Submitted", "Actions"]}
            emptyMessage="No applications match the current filters."
            rows={filteredApplications.map((application) => [
              <td key="student">{application.student?.name}</td>,
              <td key="course">{application.student?.course || "Not set"}</td>,
              <td key="job">{application.job?.title}</td>,
              <td key="provider">{application.job?.providerName}</td>,
              <td key="status"><StatusBadge status={application.status} /></td>,
              <td key="submitted">{formatDate(application.createdAt)}</td>,
              <td key="actions">
                {application.status === "pending" ? (
                  <div className="table-actions">
                    <button className="primary-button compact-button" onClick={() => onUpdateApplicationStatus(application.id, "approved")} type="button">
                      Approve
                    </button>
                    <button className="danger-button compact-button" onClick={() => onUpdateApplicationStatus(application.id, "rejected")} type="button">
                      Reject
                    </button>
                  </div>
                ) : application.status === "approved" ? (
                  <div className="table-actions">
                    <button className="secondary-button compact-button" onClick={() => onUpdateApplicationStatus(application.id, "completed")} type="button">
                      Mark Completed
                    </button>
                  </div>
                ) : (
                  <span className="helper-text">No action</span>
                )}
              </td>
            ])}
          />
        </section>
      ) : null}

      {activeSection === "summary" ? (
        <section className="panel panel-stack">
          <div className="panel-heading">
            <div>
              <h2>Department Reports</h2>
              <p className="section-note">Track provider work, student completion, and monthly earnings from one reporting section.</p>
            </div>
          </div>
          <HeadSummaryFilters filters={filters} onApplyFilter={onApplyFilter} />
          <TableCard
            columns={["Job", "Provider", "Status", "Assigned Students", "Completed", "Created"]}
            emptyMessage="No summary records match the current filters."
            rows={filteredSummaryJobs.map((job) => [
              <td key="job">{job.title}</td>,
              <td key="provider">{job.providerName}</td>,
              <td key="status"><StatusBadge status={job.status} /></td>,
              <td key="approved">
                {job.approvedStudentDetails?.length
                  ? job.approvedStudentDetails.map((student) => student.name).join(", ")
                  : "No assigned students"}
              </td>,
              <td key="completed">{job.completedStudents}</td>,
              <td key="created">{formatDate(job.createdAt)}</td>
            ])}
          />
          <div className="panel-stack">
            <div className="panel-heading">
              <div>
                <h3>Student Records</h3>
                <p className="section-note">Each student record shows applications, completed work, and total earnings.</p>
              </div>
            </div>
            <HeadReportFilters filters={filters} onApplyFilter={onApplyFilter} />
            <TableCard
              columns={["Student", "Course", "Residence", "Applications", "Completed", "This Month", "Total Earnings", "Last Completed"]}
              emptyMessage="No student records match the current report filters."
              rows={headStudentRecords.map((student) => [
                <td key="student">{student.name}</td>,
                <td key="course">{student.course}</td>,
                <td key="residence">{student.residence}</td>,
                <td key="applications">{student.totalApplications}</td>,
                <td key="completed">{student.completedCount}</td>,
                <td key="month">{formatCurrency(student.monthlyEarnings)}</td>,
                <td key="total">{formatCurrency(student.totalEarnings)}</td>,
                <td key="last">{student.lastCompletedAt ? formatDate(student.lastCompletedAt) : "Not completed yet"}</td>
              ])}
            />
          </div>
          <div className="panel-stack">
            <div className="panel-heading">
              <div>
                <h3>Monthly Earnings Report</h3>
                <p className="section-note">See how many completed jobs and earnings were recorded each month.</p>
              </div>
            </div>
            <TableCard
              columns={["Month", "Completed Work", "Students", "Providers", "Total Earnings"]}
              emptyMessage="No monthly earnings records match the current report filters."
              rows={headMonthlyReport.map((month) => [
                <td key="month">{month.label}</td>,
                <td key="completed">{month.completedCount}</td>,
                <td key="students">{month.studentCount}</td>,
                <td key="providers">{month.providerCount}</td>,
                <td key="earnings">{formatCurrency(month.totalEarnings)}</td>
              ])}
            />
          </div>
        </section>
      ) : null}

      {activeSection === "profile" ? (
        <section className="dashboard-single">
          <div className="panel panel-stack panel-narrow">
            <div className="panel-heading">
              <div>
                <h2>Edit Department Profile</h2>
                <p className="section-note">Keep department ownership and contact information current.</p>
              </div>
            </div>
            <form className="form-grid" onSubmit={onProfileSubmit}>
              <Field error={errors.profile.name} label="Full name">
                <input value={profileForm.name || ""} onChange={(event) => onProfileFormChange({ ...profileForm, name: event.target.value })} required />
              </Field>
              <Field error={errors.profile.phone} label="Phone number">
                <input value={profileForm.phone || ""} onChange={(event) => onProfileFormChange({ ...profileForm, phone: event.target.value })} required />
              </Field>
              <Field className="full-width" error={errors.profile.department} label="Department name">
                <input value={profileForm.department || ""} onChange={(event) => onProfileFormChange({ ...profileForm, department: event.target.value })} required />
              </Field>
              <div className="full-width inline-actions">
                <button className="secondary-button" type="submit">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      {activeSection === "security" ? (
        <section className="dashboard-single">
          <div className="panel panel-stack panel-narrow">
            <div className="panel-heading">
              <div>
                <h2>Security</h2>
                <p className="section-note">Open a secure modal to change your password without leaving the dashboard.</p>
              </div>
            </div>
            <button className="secondary-button" onClick={() => setIsPasswordModalOpen(true)} type="button">
              Change Password
            </button>
          </div>
        </section>
      ) : null}

      {isPasswordModalOpen ? (
        <Modal onClose={() => setIsPasswordModalOpen(false)} title="Change Password">
          <PasswordPanel
            errors={errors.changePassword}
            form={changePasswordForm}
            onChange={onChangePasswordForm}
            onSubmit={async (event) => {
              const success = await onChangePasswordSubmit(event);
              if (success) {
                setIsPasswordModalOpen(false);
              }
            }}
          />
        </Modal>
      ) : null}
    </DashboardShell>
  );
}

function HeadJobFilters({ filters, onApplyFilter }) {
  return (
    <FilterBar>
      <input className="search-input" placeholder="Search jobs" value={filters.headJobsQuery} onChange={(event) => onApplyFilter({ ...filters, headJobsQuery: event.target.value })} />
      <input placeholder="Provider" value={filters.headJobsProvider} onChange={(event) => onApplyFilter({ ...filters, headJobsProvider: event.target.value })} />
      <select value={filters.headJobsStatus} onChange={(event) => onApplyFilter({ ...filters, headJobsStatus: event.target.value })}>
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <input type="date" value={filters.headJobsFrom} onChange={(event) => onApplyFilter({ ...filters, headJobsFrom: event.target.value })} />
      <input type="date" value={filters.headJobsTo} onChange={(event) => onApplyFilter({ ...filters, headJobsTo: event.target.value })} />
    </FilterBar>
  );
}

function HeadApplicationFilters({ filters, onApplyFilter }) {
  return (
    <FilterBar>
      <input className="search-input" placeholder="Search applications" value={filters.headApplicationsQuery} onChange={(event) => onApplyFilter({ ...filters, headApplicationsQuery: event.target.value })} />
      <input placeholder="Provider" value={filters.headApplicationsProvider} onChange={(event) => onApplyFilter({ ...filters, headApplicationsProvider: event.target.value })} />
      <select value={filters.headApplicationsStatus} onChange={(event) => onApplyFilter({ ...filters, headApplicationsStatus: event.target.value })}>
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
      </select>
      <input type="date" value={filters.headApplicationsFrom} onChange={(event) => onApplyFilter({ ...filters, headApplicationsFrom: event.target.value })} />
      <input type="date" value={filters.headApplicationsTo} onChange={(event) => onApplyFilter({ ...filters, headApplicationsTo: event.target.value })} />
    </FilterBar>
  );
}

function HeadSummaryFilters({ filters, onApplyFilter }) {
  return (
    <FilterBar>
      <input className="search-input" placeholder="Search job records" value={filters.headSummaryQuery} onChange={(event) => onApplyFilter({ ...filters, headSummaryQuery: event.target.value })} />
      <input placeholder="Provider" value={filters.headSummaryProvider} onChange={(event) => onApplyFilter({ ...filters, headSummaryProvider: event.target.value })} />
      <select value={filters.headSummaryStatus} onChange={(event) => onApplyFilter({ ...filters, headSummaryStatus: event.target.value })}>
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <input type="date" value={filters.headSummaryFrom} onChange={(event) => onApplyFilter({ ...filters, headSummaryFrom: event.target.value })} />
      <input type="date" value={filters.headSummaryTo} onChange={(event) => onApplyFilter({ ...filters, headSummaryTo: event.target.value })} />
    </FilterBar>
  );
}

function HeadReportFilters({ filters, onApplyFilter }) {
  return (
    <FilterBar>
      <input className="search-input" placeholder="Search students, jobs, or providers" value={filters.headReportQuery} onChange={(event) => onApplyFilter({ ...filters, headReportQuery: event.target.value })} />
      <input placeholder="Provider" value={filters.headReportProvider} onChange={(event) => onApplyFilter({ ...filters, headReportProvider: event.target.value })} />
      <select value={filters.headReportStatus} onChange={(event) => onApplyFilter({ ...filters, headReportStatus: event.target.value })}>
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
      </select>
      <input type="date" value={filters.headReportFrom} onChange={(event) => onApplyFilter({ ...filters, headReportFrom: event.target.value })} />
      <input type="date" value={filters.headReportTo} onChange={(event) => onApplyFilter({ ...filters, headReportTo: event.target.value })} />
    </FilterBar>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default HeadDashboard;
