import { useMemo, useState } from "react";

import DashboardShell from "../components/common/DashboardShell";
import EmptyState from "../components/common/EmptyState";
import Field from "../components/common/Field";
import FilterBar from "../components/common/FilterBar";
import JobCard from "../components/common/JobCard";
import Modal from "../components/common/Modal";
import PasswordPanel from "../components/common/PasswordPanel";
import StatusBadge from "../components/common/StatusBadge";

function StudentDashboard({
  changePasswordForm,
  dashboardData,
  errors,
  filteredApplications,
  filteredJobs,
  filters,
  message,
  onApplyFilter,
  onApplyToJob,
  onChangePasswordForm,
  onChangePasswordSubmit,
  onLogout,
  onProfileFormChange,
  onProfileSubmit,
  onRefresh,
  onWithdrawApplication,
  profileForm,
  stats,
  user
}) {
  const [activeSection, setActiveSection] = useState("opportunities");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState(null);

  const navItems = useMemo(
    () => [
      { id: "opportunities", label: "Opportunities", note: "Find and apply for work" },
      { id: "applications", label: "Applications", note: "Track your current applications" },
      { id: "profile", label: "Profile", note: "Student details and readiness" },
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
      subtitle="See approved work, update your student profile, and manage pending applications with more control."
      title="Student Dashboard"
      user={user}
    >
      {activeSection === "opportunities" ? (
        <section className="dashboard-single">
          <section className="panel panel-stack">
            <div className="panel-heading">
              <div>
                <h2>Approved Work Opportunities</h2>
                <p className="section-note">Search live opportunities and apply only to work you genuinely want to do.</p>
              </div>
            </div>
            <FilterBar>
              <input
                className="search-input"
                placeholder="Search by title, location, or provider"
                value={filters.studentJobs}
                onChange={(event) => onApplyFilter({ ...filters, studentJobs: event.target.value })}
              />
            </FilterBar>
            <div className="card-list">
              {filteredJobs.length ? (
                filteredJobs.map((job) => {
                  const existingApplication = dashboardData.myApplications.find((item) => item.job?.id === job.id);
                  const filled = job.approvedStudents >= job.positions;
                  return (
                    <JobCard
                      key={job.id}
                      actions={
                        <button
                          className={existingApplication ? "secondary-button" : "primary-button"}
                          disabled={Boolean(existingApplication) || filled}
                          onClick={() => onApplyToJob(job.id)}
                          type="button"
                        >
                          {existingApplication
                            ? `Application ${capitalize(existingApplication.status)}`
                            : filled
                              ? "Positions Filled"
                              : "Apply For This Work"}
                        </button>
                      }
                      job={job}
                    />
                  );
                })
              ) : (
                <EmptyState message="No approved jobs match your current search." />
              )}
            </div>
          </section>
        </section>
      ) : null}

      {activeSection === "applications" ? (
        <section className="dashboard-single">
          <section className="panel panel-stack">
            <div className="panel-heading">
              <div>
                <h2>Your Application Status</h2>
                <p className="section-note">Pending applications can be withdrawn before the department head takes action.</p>
              </div>
            </div>
            <FilterBar>
              <input
                className="search-input"
                placeholder="Search your applications"
                value={filters.studentApplications}
                onChange={(event) => onApplyFilter({ ...filters, studentApplications: event.target.value })}
              />
            </FilterBar>
            <div className="card-list">
              {filteredApplications.length ? (
                filteredApplications.map((application) => (
                  <article className="job-card" key={application.id}>
                    <div className="job-card-header">
                      <div>
                        <h3>{application.job?.title}</h3>
                        <p className="job-description">
                          {application.job?.providerName} | {application.job?.location}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                    <div className="job-meta">
                      <div>
                        <strong>Payment</strong>INR {application.job?.pay}
                      </div>
                      <div>
                        <strong>Hours</strong>{application.job?.hours}
                      </div>
                      <div>
                        <strong>Work type</strong>{application.job?.workType}
                      </div>
                      <div>
                        <strong>Applied on</strong>{formatDate(application.createdAt)}
                      </div>
                    </div>
                    {application.status === "pending" ? (
                      <div className="card-actions">
                        <button className="danger-button" onClick={() => setApplicationToWithdraw(application)} type="button">
                          Withdraw Application
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <EmptyState message="No applications match your current search." />
              )}
            </div>
          </section>
        </section>
      ) : null}

      {activeSection === "profile" ? (
        <section className="dashboard-single">
          <div className="panel panel-stack panel-narrow">
            <div className="panel-heading">
              <div>
                <h2>Edit Student Profile</h2>
                <p className="section-note">A strong profile helps the department head approve faster and more confidently.</p>
              </div>
            </div>
            <form className="form-grid" onSubmit={onProfileSubmit}>
              <Field error={errors.profile.name} label="Full name">
                <input value={profileForm.name || ""} onChange={(event) => onProfileFormChange({ ...profileForm, name: event.target.value })} required />
              </Field>
              <Field error={errors.profile.phone} label="Phone number">
                <input value={profileForm.phone || ""} onChange={(event) => onProfileFormChange({ ...profileForm, phone: event.target.value })} required />
              </Field>
              <Field error={errors.profile.course} label="Course / year">
                <input value={profileForm.course || ""} onChange={(event) => onProfileFormChange({ ...profileForm, course: event.target.value })} required />
              </Field>
              <Field error={errors.profile.residence} label="Hostel / area">
                <input value={profileForm.residence || ""} onChange={(event) => onProfileFormChange({ ...profileForm, residence: event.target.value })} required />
              </Field>
              <Field className="full-width" error={errors.profile.skills} label="Skills">
                <input value={profileForm.skills || ""} onChange={(event) => onProfileFormChange({ ...profileForm, skills: event.target.value })} required />
              </Field>
              <Field className="full-width" error={errors.profile.availability} label="Availability">
                <input value={profileForm.availability || ""} onChange={(event) => onProfileFormChange({ ...profileForm, availability: event.target.value })} required />
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
                <p className="section-note">Open a secure modal to change your account password.</p>
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

      {applicationToWithdraw ? (
        <Modal
          actions={
            <>
              <button className="ghost-button" onClick={() => setApplicationToWithdraw(null)} type="button">
                Cancel
              </button>
              <button
                className="danger-button"
                onClick={() => {
                  onWithdrawApplication(applicationToWithdraw.id);
                  setApplicationToWithdraw(null);
                }}
                type="button"
              >
                Withdraw
              </button>
            </>
          }
          onClose={() => setApplicationToWithdraw(null)}
          title="Withdraw Application"
        >
          <p className="job-description">
            Withdraw your application for <strong>{applicationToWithdraw.job?.title}</strong>?
          </p>
        </Modal>
      ) : null}
    </DashboardShell>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default StudentDashboard;
