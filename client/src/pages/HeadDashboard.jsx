import DashboardShell from "../components/common/DashboardShell";
import Field from "../components/common/Field";
import FilterBar from "../components/common/FilterBar";
import PasswordPanel from "../components/common/PasswordPanel";
import TableCard from "../components/common/TableCard";

function HeadDashboard({
  changePasswordForm,
  errors,
  filteredApplications,
  filteredJobs,
  filteredSummary,
  filters,
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
  return (
    <DashboardShell
      message={message}
      onLogout={onLogout}
      onRefresh={onRefresh}
      stats={stats}
      subtitle="Manage approval queues with searchable tables, role visibility, and stronger workflow control."
      title="Department Head Dashboard"
      user={user}
    >
      <section className="dashboard-grid">
        <div className="panel panel-stack">
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

        <PasswordPanel
          errors={errors.changePassword}
          form={changePasswordForm}
          onChange={onChangePasswordForm}
          onSubmit={onChangePasswordSubmit}
        />
      </section>

      <section className="panel panel-stack">
        <div className="panel-heading">
          <div>
            <h2>Work Waiting For Approval</h2>
            <p className="section-note">Filter pending jobs by provider, status, or date before making a decision.</p>
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
            <td key="status">{job.status}</td>,
            <td key="created">{formatDate(job.createdAt)}</td>,
            <td key="actions">
              <div className="table-actions">
                <button className="primary-button compact-button" onClick={() => onUpdateJobStatus(job.id, "approved")} type="button">
                  Approve
                </button>
                <button className="danger-button compact-button" onClick={() => onUpdateJobStatus(job.id, "rejected")} type="button">
                  Reject
                </button>
              </div>
            </td>
          ])}
        />
      </section>

      <section className="panel panel-stack">
        <div className="panel-heading">
          <div>
            <h2>Student Applications Waiting For Approval</h2>
            <p className="section-note">Review students in a table with provider, date, and status filters.</p>
          </div>
        </div>
        <HeadApplicationFilters filters={filters} onApplyFilter={onApplyFilter} />
        <TableCard
          columns={["Student", "Course", "Job", "Provider", "Submitted", "Actions"]}
          emptyMessage="No applications match the current filters."
          rows={filteredApplications.map((application) => [
            <td key="student">{application.student?.name}</td>,
            <td key="course">{application.student?.course || "Not set"}</td>,
            <td key="job">{application.job?.title}</td>,
            <td key="provider">{application.job?.providerName}</td>,
            <td key="submitted">{formatDate(application.createdAt)}</td>,
            <td key="actions">
              <div className="table-actions">
                <button className="primary-button compact-button" onClick={() => onUpdateApplicationStatus(application.id, "approved")} type="button">
                  Approve
                </button>
                <button className="danger-button compact-button" onClick={() => onUpdateApplicationStatus(application.id, "rejected")} type="button">
                  Reject
                </button>
              </div>
            </td>
          ])}
        />
      </section>

      <section className="panel panel-stack">
        <div className="panel-heading">
          <div>
            <h2>Provider Reporting Summary</h2>
            <p className="section-note">Use filters to inspect confirmed assignments across providers and date ranges.</p>
          </div>
        </div>
        <HeadSummaryFilters filters={filters} onApplyFilter={onApplyFilter} />
        <TableCard
          columns={["Job", "Provider", "Status", "Approved Students", "Created"]}
          emptyMessage="No summary records match the current filters."
          rows={filteredSummary.map((job) => [
            <td key="job">{job.title}</td>,
            <td key="provider">{job.providerName}</td>,
            <td key="status">{job.status}</td>,
            <td key="approved">
              {job.approvedStudentDetails?.length
                ? job.approvedStudentDetails.map((student) => student.name).join(", ")
                : "No approved students"}
            </td>,
            <td key="created">{formatDate(job.createdAt)}</td>
          ])}
        />
      </section>
    </DashboardShell>
  );
}

function HeadJobFilters({ filters, onApplyFilter }) {
  return (
    <FilterBar>
      <input className="search-input" placeholder="Search pending jobs" value={filters.headJobsQuery} onChange={(event) => onApplyFilter({ ...filters, headJobsQuery: event.target.value })} />
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
      </select>
      <input type="date" value={filters.headApplicationsFrom} onChange={(event) => onApplyFilter({ ...filters, headApplicationsFrom: event.target.value })} />
      <input type="date" value={filters.headApplicationsTo} onChange={(event) => onApplyFilter({ ...filters, headApplicationsTo: event.target.value })} />
    </FilterBar>
  );
}

function HeadSummaryFilters({ filters, onApplyFilter }) {
  return (
    <FilterBar>
      <input className="search-input" placeholder="Search summary records" value={filters.headSummaryQuery} onChange={(event) => onApplyFilter({ ...filters, headSummaryQuery: event.target.value })} />
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

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default HeadDashboard;
