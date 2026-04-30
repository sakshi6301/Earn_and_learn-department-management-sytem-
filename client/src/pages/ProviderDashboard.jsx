import DashboardShell from "../components/common/DashboardShell";
import EmptyState from "../components/common/EmptyState";
import Field from "../components/common/Field";
import FilterBar from "../components/common/FilterBar";
import InfoGrid from "../components/common/InfoGrid";
import JobCard from "../components/common/JobCard";
import PasswordPanel from "../components/common/PasswordPanel";

function ProviderDashboard({
  changePasswordForm,
  editingJobId,
  errors,
  filteredJobs,
  filters,
  jobForm,
  message,
  onApplyFilter,
  onCancelEditingJob,
  onChangePasswordForm,
  onChangePasswordSubmit,
  onDeleteJob,
  onEditJob,
  onJobFormChange,
  onLogout,
  onProfileFormChange,
  onProfileSubmit,
  onRefresh,
  onSubmitJob,
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
      subtitle="Submit work opportunities, keep your provider details current, and manage pending jobs before approval."
      title="Provider Dashboard"
      user={user}
    >
      <section className="dashboard-grid">
        <div className="panel panel-stack">
          <div className="panel-heading">
            <div>
              <h2>{editingJobId ? "Edit Pending Job" : "Register New Work"}</h2>
              <p className="section-note">Only pending jobs can be edited or deleted before department review.</p>
            </div>
          </div>
          <form className="form-grid" onSubmit={onSubmitJob}>
            <Field error={errors.job.title} label="Work title">
              <input value={jobForm.title} onChange={(event) => onJobFormChange({ ...jobForm, title: event.target.value })} required />
            </Field>
            <Field error={errors.job.workType} label="Work type">
              <select value={jobForm.workType} onChange={(event) => onJobFormChange({ ...jobForm, workType: event.target.value })}>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </Field>
            <Field error={errors.job.location} label="Location">
              <input value={jobForm.location} onChange={(event) => onJobFormChange({ ...jobForm, location: event.target.value })} required />
            </Field>
            <Field error={errors.job.pay} label="Payment amount (INR)">
              <input type="number" value={jobForm.pay} onChange={(event) => onJobFormChange({ ...jobForm, pay: event.target.value })} required />
            </Field>
            <Field error={errors.job.hours} label="Work hours">
              <input value={jobForm.hours} onChange={(event) => onJobFormChange({ ...jobForm, hours: event.target.value })} required />
            </Field>
            <Field error={errors.job.positions} label="Number of students needed">
              <input type="number" value={jobForm.positions} onChange={(event) => onJobFormChange({ ...jobForm, positions: event.target.value })} required />
            </Field>
            <Field className="full-width" error={errors.job.skills} label="Skills required">
              <input value={jobForm.skills} onChange={(event) => onJobFormChange({ ...jobForm, skills: event.target.value })} />
            </Field>
            <Field className="full-width" error={errors.job.description} label="Work description">
              <textarea rows="4" value={jobForm.description} onChange={(event) => onJobFormChange({ ...jobForm, description: event.target.value })} required />
            </Field>
            <div className="full-width inline-actions">
              <button className="primary-button" type="submit">
                {editingJobId ? "Save Changes" : "Submit For Approval"}
              </button>
              {editingJobId ? (
                <button className="ghost-button" onClick={onCancelEditingJob} type="button">
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="panel panel-stack">
          <div className="panel-heading">
            <div>
              <h2>Edit Provider Profile</h2>
              <p className="section-note">This information is attached to jobs automatically. Keep it accurate.</p>
            </div>
          </div>
          <form className="form-grid" onSubmit={onProfileSubmit}>
            <Field error={errors.profile.name} label="Full name">
              <input value={profileForm.name || ""} onChange={(event) => onProfileFormChange({ ...profileForm, name: event.target.value })} required />
            </Field>
            <Field error={errors.profile.phone} label="Phone number">
              <input value={profileForm.phone || ""} onChange={(event) => onProfileFormChange({ ...profileForm, phone: event.target.value })} required />
            </Field>
            <Field className="full-width" error={errors.profile.organizationName} label="Organization name">
              <input value={profileForm.organizationName || ""} onChange={(event) => onProfileFormChange({ ...profileForm, organizationName: event.target.value })} required />
            </Field>
            <Field error={errors.profile.providerType} label="Provider type">
              <select value={profileForm.providerType || "Organization"} onChange={(event) => onProfileFormChange({ ...profileForm, providerType: event.target.value })}>
                <option value="Organization">Organization</option>
                <option value="Person">Person</option>
              </select>
            </Field>
            <Field error={errors.profile.officeLocation} label="Office location">
              <input value={profileForm.officeLocation || ""} onChange={(event) => onProfileFormChange({ ...profileForm, officeLocation: event.target.value })} required />
            </Field>
            <div className="full-width inline-actions">
              <button className="secondary-button" type="submit">
                Save Profile
              </button>
            </div>
          </form>
          <InfoGrid
            items={[
              ["Email", user.email],
              ["Organization", profileForm.organizationName || "Not set"],
              ["Provider type", profileForm.providerType || "Not set"],
              ["Location", profileForm.officeLocation || "Not set"]
            ]}
          />
        </div>
      </section>

      <section className="dashboard-grid">
        <PasswordPanel
          errors={errors.changePassword}
          form={changePasswordForm}
          onChange={onChangePasswordForm}
          onSubmit={onChangePasswordSubmit}
        />

        <section className="panel panel-stack">
          <div className="panel-heading">
            <div>
              <h2>Your Submitted Work</h2>
              <p className="section-note">Use search to find jobs quickly and manage pending items directly from the list.</p>
            </div>
          </div>
          <FilterBar>
            <input
              className="search-input"
              placeholder="Search by title, location, or organization"
              value={filters.providerJobs}
              onChange={(event) => onApplyFilter({ ...filters, providerJobs: event.target.value })}
            />
          </FilterBar>
          <div className="card-list">
            {filteredJobs.length ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  actions={
                    job.status === "pending"
                      ? [
                          <button className="secondary-button" key="edit" onClick={() => onEditJob(job)} type="button">
                            Edit Pending Job
                          </button>,
                          <button className="danger-button" key="delete" onClick={() => onDeleteJob(job.id)} type="button">
                            Delete Pending Job
                          </button>
                        ]
                      : null
                  }
                  job={job}
                >
                  {job.approvedStudentDetails?.length ? (
                    <p className="helper-text">
                      <strong>Approved students:</strong>{" "}
                      {job.approvedStudentDetails.map((student) => `${student.name} (${student.phone})`).join(", ")}
                    </p>
                  ) : (
                    <p className="helper-text">No students approved for this job yet.</p>
                  )}
                </JobCard>
              ))
            ) : (
              <EmptyState message="No jobs match your current search." />
            )}
          </div>
        </section>
      </section>
    </DashboardShell>
  );
}

export default ProviderDashboard;
