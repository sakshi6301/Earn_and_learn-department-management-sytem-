import { useEffect, useMemo, useState } from "react";

import api, { setAuthToken } from "./api";
import AuthPage from "./pages/AuthPage";
import HeadDashboard from "./pages/HeadDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { filterApplications, filterJobs, filterSummaryJobs, withinDateRange } from "./utils/filters";
import {
  createEmptyChangePasswordForm,
  createEmptyJobForm,
  createEmptyRegisterForm,
  createEmptyResetConfirmForm,
  createEmptyResetRequestForm,
  profileFromUser,
  validateChangePassword,
  validateJobForm,
  validateLoginForm,
  validateProfileForm,
  validateRegisterForm,
  validateResetConfirmForm,
  validateResetRequestForm
} from "./utils/validation";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState(createEmptyRegisterForm());
  const [resetRequestForm, setResetRequestForm] = useState(createEmptyResetRequestForm());
  const [resetConfirmForm, setResetConfirmForm] = useState(createEmptyResetConfirmForm());
  const [changePasswordForm, setChangePasswordForm] = useState(createEmptyChangePasswordForm());
  const [jobForm, setJobForm] = useState(createEmptyJobForm());
  const [editingJobId, setEditingJobId] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [filters, setFilters] = useState({
    providerJobs: "",
    studentJobs: "",
    studentApplications: "",
    headJobsQuery: "",
    headJobsStatus: "all",
    headJobsProvider: "",
    headJobsFrom: "",
    headJobsTo: "",
    headApplicationsQuery: "",
    headApplicationsStatus: "all",
    headApplicationsProvider: "",
    headApplicationsFrom: "",
    headApplicationsTo: "",
    headSummaryQuery: "",
    headSummaryStatus: "all",
    headSummaryProvider: "",
    headSummaryFrom: "",
    headSummaryTo: ""
  });
  const [errors, setErrors] = useState({
    login: {},
    register: {},
    resetRequest: {},
    resetConfirm: {},
    profile: {},
    changePassword: {},
    job: {}
  });
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("earn-learn-session");
    return saved ? JSON.parse(saved) : { token: "", user: null };
  });
  const [dashboardData, setDashboardData] = useState({
    myJobs: [],
    approvedJobs: [],
    pendingJobs: [],
    summaryJobs: [],
    myApplications: [],
    pendingApplications: []
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = session.user?.role;

  useEffect(() => {
    setAuthToken(session.token);
  }, [session.token]);

  useEffect(() => {
    if (session.user) {
      setProfileForm(profileFromUser(session.user));
      loadDashboard(session.user.role);
    }
  }, [session.user]);

  const stats = useMemo(() => {
    if (role === "provider") {
      return [
        { label: "Total jobs", value: dashboardData.myJobs.length },
        { label: "Approved jobs", value: dashboardData.myJobs.filter((job) => job.status === "approved").length },
        { label: "Pending approvals", value: dashboardData.myJobs.filter((job) => job.status === "pending").length },
        { label: "Approved students", value: dashboardData.summaryJobs.reduce((sum, job) => sum + job.approvedStudents, 0) }
      ];
    }

    if (role === "student") {
      return [
        { label: "Visible jobs", value: dashboardData.approvedJobs.length },
        { label: "Your applications", value: dashboardData.myApplications.length },
        { label: "Approved applications", value: dashboardData.myApplications.filter((item) => item.status === "approved").length },
        { label: "Pending decisions", value: dashboardData.myApplications.filter((item) => item.status === "pending").length }
      ];
    }

    return [
      { label: "Pending job approvals", value: dashboardData.pendingJobs.length },
      { label: "Pending student approvals", value: dashboardData.pendingApplications.length },
      { label: "Approved jobs", value: dashboardData.summaryJobs.filter((job) => job.status === "approved").length },
      { label: "Students sent to providers", value: dashboardData.summaryJobs.reduce((sum, job) => sum + job.approvedStudents, 0) }
    ];
  }, [dashboardData, role]);

  const filteredProviderJobs = useMemo(
    () => filterJobs(dashboardData.summaryJobs, filters.providerJobs),
    [dashboardData.summaryJobs, filters.providerJobs]
  );

  const filteredStudentJobs = useMemo(
    () => filterJobs(dashboardData.approvedJobs, filters.studentJobs),
    [dashboardData.approvedJobs, filters.studentJobs]
  );

  const filteredStudentApplications = useMemo(
    () => filterApplications(dashboardData.myApplications, filters.studentApplications),
    [dashboardData.myApplications, filters.studentApplications]
  );

  const filteredHeadJobs = useMemo(
    () =>
      dashboardData.pendingJobs.filter((job) => {
        const matchesQuery = filterJobs([job], filters.headJobsQuery).length > 0;
        const matchesStatus = filters.headJobsStatus === "all" || job.status === filters.headJobsStatus;
        const matchesProvider = !filters.headJobsProvider || job.providerName.toLowerCase().includes(filters.headJobsProvider.toLowerCase());
        const matchesDate = withinDateRange(job.createdAt, filters.headJobsFrom, filters.headJobsTo);
        return matchesQuery && matchesStatus && matchesProvider && matchesDate;
      }),
    [dashboardData.pendingJobs, filters]
  );

  const filteredHeadApplications = useMemo(
    () =>
      dashboardData.pendingApplications.filter((application) => {
        const matchesQuery = filterApplications([application], filters.headApplicationsQuery).length > 0;
        const matchesStatus =
          filters.headApplicationsStatus === "all" || application.status === filters.headApplicationsStatus;
        const matchesProvider =
          !filters.headApplicationsProvider ||
          application.job?.providerName?.toLowerCase().includes(filters.headApplicationsProvider.toLowerCase());
        const matchesDate = withinDateRange(application.createdAt, filters.headApplicationsFrom, filters.headApplicationsTo);
        return matchesQuery && matchesStatus && matchesProvider && matchesDate;
      }),
    [dashboardData.pendingApplications, filters]
  );

  const filteredHeadSummary = useMemo(
    () =>
      dashboardData.summaryJobs.filter((job) => {
        const matchesQuery = filterSummaryJobs([job], filters.headSummaryQuery).length > 0;
        const matchesStatus = filters.headSummaryStatus === "all" || job.status === filters.headSummaryStatus;
        const matchesProvider =
          !filters.headSummaryProvider || job.providerName.toLowerCase().includes(filters.headSummaryProvider.toLowerCase());
        const matchesDate = withinDateRange(job.createdAt, filters.headSummaryFrom, filters.headSummaryTo);
        return matchesQuery && matchesStatus && matchesProvider && matchesDate;
      }),
    [dashboardData.summaryJobs, filters]
  );

  const persistSession = (nextSession) => {
    setSession(nextSession);
    localStorage.setItem("earn-learn-session", JSON.stringify(nextSession));
  };

  const clearSession = () => {
    setSession({ token: "", user: null });
    setDashboardData({
      myJobs: [],
      approvedJobs: [],
      pendingJobs: [],
      summaryJobs: [],
      myApplications: [],
      pendingApplications: []
    });
    localStorage.removeItem("earn-learn-session");
    setAuthToken("");
  };

  const notify = (text, type = "success") => setMessage({ text, type });

  const setFormErrors = (key, nextErrors) => {
    setErrors((previous) => ({ ...previous, [key]: nextErrors }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(loginForm);
    setFormErrors("login", nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", loginForm);
      persistSession(data);
      setLoginForm({ email: "", password: "" });
      notify(`Logged in as ${data.user.name}.`);
    } catch (error) {
      notify(error.response?.data?.message || "Unable to login.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegisterForm(registerForm);
    setFormErrors("register", nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const payload = { ...registerForm };
      delete payload.confirmPassword;
      await api.post("/auth/register", payload);
      setRegisterForm(createEmptyRegisterForm());
      setLoginForm((previous) => ({ ...previous, email: registerForm.email }));
      setAuthMode("login");
      notify("Account created successfully. Please sign in with your new account.");
    } catch (error) {
      notify(error.response?.data?.message || "Unable to register.", "error");
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (event) => {
    event.preventDefault();
    const nextErrors = validateResetRequestForm(resetRequestForm);
    setFormErrors("resetRequest", nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/request-password-reset", resetRequestForm);
      setResetConfirmForm((previous) => ({
        ...previous,
        email: resetRequestForm.email,
        resetToken: data.resetToken || ""
      }));
      setAuthMode("resetConfirm");
      notify(data.resetToken ? `Reset token generated: ${data.resetToken}` : data.message);
    } catch (error) {
      notify(error.response?.data?.message || "Unable to request password reset.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    const nextErrors = validateResetConfirmForm(resetConfirmForm);
    setFormErrors("resetConfirm", nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await api.post("/auth/reset-password", resetConfirmForm);
      setResetConfirmForm(createEmptyResetConfirmForm());
      setAuthMode("login");
      notify("Password reset successfully. Please sign in.");
    } catch (error) {
      notify(error.response?.data?.message || "Unable to reset password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    const nextErrors = validateChangePassword(changePasswordForm);
    setFormErrors("changePassword", nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await api.patch("/auth/change-password", {
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword
      });
      setChangePasswordForm(createEmptyChangePasswordForm());
      notify("Password changed successfully.");
    } catch (error) {
      notify(error.response?.data?.message || "Unable to change password.", "error");
    }
  };

  const loadDashboard = async (activeRole = role) => {
    if (!activeRole) return;
    try {
      if (activeRole === "provider") {
        const [myJobs, summaryJobs] = await Promise.all([api.get("/jobs/mine"), api.get("/jobs/summary")]);
        setDashboardData((previous) => ({ ...previous, myJobs: myJobs.data, summaryJobs: summaryJobs.data }));
      }

      if (activeRole === "student") {
        const [approvedJobs, myApplications] = await Promise.all([api.get("/jobs/approved"), api.get("/applications/mine")]);
        setDashboardData((previous) => ({ ...previous, approvedJobs: approvedJobs.data, myApplications: myApplications.data }));
      }

      if (activeRole === "head") {
        const [pendingJobs, pendingApplications, summaryJobs] = await Promise.all([
          api.get("/jobs/pending"),
          api.get("/applications/pending"),
          api.get("/jobs/summary")
        ]);
        setDashboardData((previous) => ({
          ...previous,
          pendingJobs: pendingJobs.data,
          pendingApplications: pendingApplications.data,
          summaryJobs: summaryJobs.data
        }));
      }
    } catch (error) {
      notify(error.response?.data?.message || "Unable to load dashboard data.", "error");
    }
  };

  const submitJob = async (event) => {
    event.preventDefault();
    const nextErrors = validateJobForm(jobForm);
    setFormErrors("job", nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      ...jobForm,
      pay: Number(jobForm.pay),
      positions: Number(jobForm.positions)
    };

    try {
      if (editingJobId) {
        await api.patch(`/jobs/${editingJobId}`, payload);
        notify("Pending job updated successfully.");
      } else {
        await api.post("/jobs", payload);
        notify("Work opportunity submitted for approval.");
      }
      setJobForm(createEmptyJobForm());
      setEditingJobId(null);
      setFormErrors("job", {});
      loadDashboard();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to save job.", "error");
    }
  };

  const startEditingJob = (job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      workType: job.workType,
      location: job.location,
      pay: String(job.pay),
      hours: job.hours,
      positions: String(job.positions),
      skills: job.skills || "",
      description: job.description
    });
  };

  const cancelEditingJob = () => {
    setEditingJobId(null);
    setJobForm(createEmptyJobForm());
    setFormErrors("job", {});
  };

  const deleteJob = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      if (editingJobId === jobId) {
        cancelEditingJob();
      }
      notify("Pending job deleted.");
      loadDashboard();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to delete job.", "error");
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const nextErrors = validateProfileForm(role, profileForm);
    setFormErrors("profile", nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const { data } = await api.patch("/auth/me", profileForm);
      persistSession({ token: session.token, user: data.user });
      notify("Profile updated.");
    } catch (error) {
      notify(error.response?.data?.message || "Unable to update profile.", "error");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await api.post("/applications", { jobId });
      notify("Application submitted to the department head.");
      loadDashboard();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to apply for this job.", "error");
    }
  };

  const withdrawApplication = async (applicationId) => {
    try {
      await api.delete(`/applications/${applicationId}`);
      notify("Application withdrawn.");
      loadDashboard();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to withdraw application.", "error");
    }
  };

  const updateJobStatus = async (id, status) => {
    try {
      await api.patch(`/jobs/${id}/status`, { status });
      notify(`Job marked as ${status}.`);
      loadDashboard();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to update job status.", "error");
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      notify(`Application marked as ${status}.`);
      loadDashboard();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to update application status.", "error");
    }
  };

  const logout = () => {
    clearSession();
    setAuthMode("login");
    notify("Logged out.");
  };

  if (!session.user) {
    return (
      <AuthPage
        authMode={authMode}
        changePasswordForm={changePasswordForm}
        errors={errors}
        loading={loading}
        loginForm={loginForm}
        message={message}
        onAuthModeChange={setAuthMode}
        onLoginSubmit={handleLogin}
        onLoginFormChange={setLoginForm}
        onRegisterFormChange={setRegisterForm}
        onRegisterSubmit={handleRegister}
        onRequestResetSubmit={requestPasswordReset}
        onResetConfirmSubmit={resetPassword}
        registerForm={registerForm}
        resetConfirmForm={resetConfirmForm}
        resetRequestForm={resetRequestForm}
        setResetConfirmForm={setResetConfirmForm}
        setResetRequestForm={setResetRequestForm}
      />
    );
  }

  if (role === "provider") {
    return (
      <ProviderDashboard
        changePasswordForm={changePasswordForm}
        editingJobId={editingJobId}
        errors={errors}
        filteredJobs={filteredProviderJobs}
        filters={filters}
        jobForm={jobForm}
        message={message}
        onApplyFilter={setFilters}
        onCancelEditingJob={cancelEditingJob}
        onChangePasswordForm={setChangePasswordForm}
        onChangePasswordSubmit={changePassword}
        onDeleteJob={deleteJob}
        onEditJob={startEditingJob}
        onJobFormChange={setJobForm}
        onLogout={logout}
        onProfileFormChange={setProfileForm}
        onProfileSubmit={saveProfile}
        onRefresh={() => loadDashboard()}
        onSubmitJob={submitJob}
        profileForm={profileForm}
        stats={stats}
        user={session.user}
      />
    );
  }

  if (role === "student") {
    return (
      <StudentDashboard
        changePasswordForm={changePasswordForm}
        dashboardData={dashboardData}
        errors={errors}
        filteredApplications={filteredStudentApplications}
        filteredJobs={filteredStudentJobs}
        filters={filters}
        message={message}
        onApplyFilter={setFilters}
        onApplyToJob={applyToJob}
        onChangePasswordForm={setChangePasswordForm}
        onChangePasswordSubmit={changePassword}
        onLogout={logout}
        onProfileFormChange={setProfileForm}
        onProfileSubmit={saveProfile}
        onRefresh={() => loadDashboard()}
        onWithdrawApplication={withdrawApplication}
        profileForm={profileForm}
        stats={stats}
        user={session.user}
      />
    );
  }

  return (
    <HeadDashboard
      changePasswordForm={changePasswordForm}
      errors={errors}
      filteredApplications={filteredHeadApplications}
      filteredJobs={filteredHeadJobs}
      filteredSummary={filteredHeadSummary}
      filters={filters}
      message={message}
      onApplyFilter={setFilters}
      onChangePasswordForm={setChangePasswordForm}
      onChangePasswordSubmit={changePassword}
      onLogout={logout}
      onProfileFormChange={setProfileForm}
      onProfileSubmit={saveProfile}
      onRefresh={() => loadDashboard()}
      onUpdateApplicationStatus={updateApplicationStatus}
      onUpdateJobStatus={updateJobStatus}
      profileForm={profileForm}
      stats={stats}
      user={session.user}
    />
  );
}

export default App;
