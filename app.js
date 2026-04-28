const STORAGE_KEY = "earn-learn-samiti-portal-v2";

const initialState = createInitialState();
const state = loadState();

const elements = {
  authScreen: document.querySelector("#authScreen"),
  appScreen: document.querySelector("#appScreen"),
  loginForm: document.querySelector("#loginForm"),
  registerForm: document.querySelector("#registerForm"),
  registerRole: document.querySelector("#registerRole"),
  toggleButtons: [...document.querySelectorAll(".toggle-button")],
  flashMessage: document.querySelector("#flashMessage"),
  dashboardTitle: document.querySelector("#dashboardTitle"),
  dashboardSubtitle: document.querySelector("#dashboardSubtitle"),
  currentUserName: document.querySelector("#currentUserName"),
  currentUserRole: document.querySelector("#currentUserRole"),
  dashboardContent: document.querySelector("#dashboardContent"),
  resetDataBtn: document.querySelector("#resetDataBtn"),
  logoutBtn: document.querySelector("#logoutBtn")
};

wireEvents();
syncRoleFields();
render();

function createInitialState() {
  const providerId = crypto.randomUUID();
  const studentId = crypto.randomUUID();
  const headId = crypto.randomUUID();
  const approvedJobId = crypto.randomUUID();
  const pendingJobId = crypto.randomUUID();
  const approvedApplicationId = crypto.randomUUID();

  return {
    sessionUserId: null,
    users: [
      {
        id: headId,
        role: "head",
        name: "Aarti Joshi",
        email: "head@samiti.org",
        phone: "+91 9876500001",
        password: "head123",
        department: "Earn & Learn Department",
        createdAt: new Date().toISOString()
      },
      {
        id: providerId,
        role: "provider",
        name: "Meera Kulkarni",
        email: "provider@trust.org",
        phone: "+91 9988776655",
        password: "provider123",
        organizationName: "Shikshan Vikas Trust",
        providerType: "Organization",
        officeLocation: "Pune",
        createdAt: new Date().toISOString()
      },
      {
        id: studentId,
        role: "student",
        name: "Rahul Shinde",
        email: "student@college.edu",
        phone: "+91 9000000000",
        password: "student123",
        course: "BCom, 2nd Year",
        residence: "Samiti Hostel A",
        skills: "Typing, Excel, catalog support",
        availability: "Evenings, 3 hours",
        createdAt: new Date().toISOString()
      }
    ],
    jobs: [
      {
        id: approvedJobId,
        providerUserId: providerId,
        title: "Library Records Digitization",
        providerType: "Organization",
        providerName: "Shikshan Vikas Trust",
        contactName: "Meera Kulkarni",
        contactPhone: "+91 9988776655",
        contactEmail: "provider@trust.org",
        workType: "On-site",
        location: "Pune",
        pay: 650,
        hours: "3 hours per day for 10 days",
        positions: 6,
        skills: "Typing, basic computer knowledge",
        description: "Students help scan and organize old library records for the college archive.",
        status: "approved",
        createdAt: new Date().toISOString()
      },
      {
        id: pendingJobId,
        providerUserId: providerId,
        title: "Community Survey Support",
        providerType: "Organization",
        providerName: "Shikshan Vikas Trust",
        contactName: "Meera Kulkarni",
        contactPhone: "+91 9988776655",
        contactEmail: "provider@trust.org",
        workType: "Hybrid",
        location: "Nashik",
        pay: 800,
        hours: "Weekends, 5 hours",
        positions: 4,
        skills: "Communication, Marathi",
        description: "Support field survey work and related data entry for a social development project.",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ],
    applications: [
      {
        id: approvedApplicationId,
        jobId: approvedJobId,
        studentUserId: studentId,
        status: "approved",
        createdAt: new Date().toISOString()
      }
    ]
  };
}

function wireEvents() {
  elements.toggleButtons.forEach((button) => {
    button.addEventListener("click", () => setAuthView(button.dataset.authView));
  });

  elements.registerRole.addEventListener("change", syncRoleFields);
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  elements.resetDataBtn.addEventListener("click", resetDemoData);
  elements.logoutBtn.addEventListener("click", logout);

  elements.dashboardContent.addEventListener("submit", handleDashboardSubmit);
  elements.dashboardContent.addEventListener("click", handleDashboardClick);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return structuredClone(initialState);
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setAuthView(view) {
  const isLogin = view === "login";
  elements.loginForm.classList.toggle("hidden", !isLogin);
  elements.registerForm.classList.toggle("hidden", isLogin);
  elements.toggleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.authView === view);
  });
}

function syncRoleFields() {
  const role = elements.registerRole.value;
  const fields = [...document.querySelectorAll(".role-field")];

  fields.forEach((field) => {
    const isActive = field.classList.contains(`role-${role}`);
    field.classList.toggle("hidden", !isActive);
    [...field.querySelectorAll("input, select")].forEach((input) => {
      input.required = isActive;
      if (!isActive) input.value = "";
    });
  });
}

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");

  const user = state.users.find((item) => item.email.toLowerCase() === email && item.password === password);
  if (!user) {
    showFlash("Invalid email or password. Please try again.", "error");
    return;
  }

  state.sessionUserId = user.id;
  saveState();
  event.currentTarget.reset();
  showFlash(`Logged in as ${user.name}.`, "success");
  render();
}

function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role");

  if (password !== confirmPassword) {
    showFlash("Passwords do not match.", "error");
    return;
  }

  if (state.users.some((user) => user.email.toLowerCase() === email)) {
    showFlash("An account with this email already exists.", "error");
    return;
  }

  const newUser = {
    id: crypto.randomUUID(),
    role,
    name: formData.get("name").trim(),
    email,
    phone: formData.get("phone").trim(),
    password,
    createdAt: new Date().toISOString()
  };

  if (role === "provider") {
    newUser.organizationName = formData.get("organizationName").trim();
    newUser.providerType = formData.get("providerType");
    newUser.officeLocation = formData.get("officeLocation").trim();
  }

  if (role === "student") {
    newUser.course = formData.get("course").trim();
    newUser.residence = formData.get("residence").trim();
    newUser.skills = formData.get("skills").trim();
    newUser.availability = formData.get("availability").trim();
  }

  if (role === "head") {
    newUser.department = formData.get("department").trim();
  }

  state.users.unshift(newUser);
  state.sessionUserId = newUser.id;
  saveState();
  event.currentTarget.reset();
  elements.registerRole.value = role;
  syncRoleFields();
  showFlash("Registration successful. Your restricted dashboard is ready.", "success");
  render();
}

function handleDashboardSubmit(event) {
  if (event.target.id === "providerJobForm") {
    handleProviderJobSubmit(event);
  }
}

function handleProviderJobSubmit(event) {
  event.preventDefault();
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "provider") return;

  const formData = new FormData(event.currentTarget);
  const job = {
    id: crypto.randomUUID(),
    providerUserId: currentUser.id,
    title: formData.get("title").trim(),
    providerType: currentUser.providerType,
    providerName: currentUser.organizationName || currentUser.name,
    contactName: currentUser.name,
    contactPhone: currentUser.phone,
    contactEmail: currentUser.email,
    workType: formData.get("workType"),
    location: formData.get("location").trim(),
    pay: Number(formData.get("pay")),
    hours: formData.get("hours").trim(),
    positions: Number(formData.get("positions")),
    skills: formData.get("skills").trim(),
    description: formData.get("description").trim(),
    status: "pending",
    createdAt: new Date().toISOString()
  };

  state.jobs.unshift(job);
  saveState();
  event.currentTarget.reset();
  showFlash("Work opportunity submitted for department approval.", "success");
  render();
}

function handleDashboardClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  const id = actionTarget.dataset.id;

  if (action === "approve-job") {
    updateJobStatus(id, "approved");
  }
  if (action === "reject-job") {
    updateJobStatus(id, "rejected");
  }
  if (action === "approve-application") {
    updateApplicationStatus(id, "approved");
  }
  if (action === "reject-application") {
    updateApplicationStatus(id, "rejected");
  }
  if (action === "apply-job") {
    applyToJob(id);
  }
}

function updateJobStatus(jobId, status) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "head") return;

  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;

  job.status = status;
  saveState();
  showFlash(`Job marked as ${status}.`, "success");
  render();
}

function updateApplicationStatus(applicationId, status) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "head") return;

  const application = state.applications.find((item) => item.id === applicationId);
  if (!application) return;

  application.status = status;
  saveState();
  showFlash(`Student application marked as ${status}.`, "success");
  render();
}

function applyToJob(jobId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "student") return;

  const job = state.jobs.find((item) => item.id === jobId);
  if (!job || job.status !== "approved") return;

  const approvedCount = getApprovedApplicationsForJob(job.id).length;
  if (approvedCount >= job.positions) {
    showFlash("This work opportunity is already filled.", "error");
    return;
  }

  const alreadyApplied = state.applications.some(
    (item) => item.jobId === jobId && item.studentUserId === currentUser.id
  );

  if (alreadyApplied) {
    showFlash("You have already applied for this work.", "error");
    return;
  }

  state.applications.unshift({
    id: crypto.randomUUID(),
    jobId,
    studentUserId: currentUser.id,
    status: "pending",
    createdAt: new Date().toISOString()
  });

  saveState();
  showFlash("Application submitted to the department head.", "success");
  render();
}

function logout() {
  state.sessionUserId = null;
  saveState();
  showFlash("You have been logged out.", "success");
  render();
}

function resetDemoData() {
  const fresh = createInitialState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  Object.assign(state, fresh);
  showFlash("Demo data has been reset.", "success");
  render();
}

function getCurrentUser() {
  return state.users.find((user) => user.id === state.sessionUserId) || null;
}

function getApprovedApplicationsForJob(jobId) {
  return state.applications.filter((item) => item.jobId === jobId && item.status === "approved");
}

function render() {
  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);

  elements.authScreen.classList.toggle("hidden", isLoggedIn);
  elements.appScreen.classList.toggle("hidden", !isLoggedIn);

  if (!isLoggedIn) return;

  elements.currentUserName.textContent = currentUser.name;
  elements.currentUserRole.textContent = formatRole(currentUser.role);

  if (currentUser.role === "provider") {
    renderProviderDashboard(currentUser);
  }
  if (currentUser.role === "student") {
    renderStudentDashboard(currentUser);
  }
  if (currentUser.role === "head") {
    renderHeadDashboard(currentUser);
  }
}

function renderProviderDashboard(user) {
  const providerJobs = state.jobs.filter((job) => job.providerUserId === user.id);
  const approvedJobs = providerJobs.filter((job) => job.status === "approved").length;
  const pendingJobs = providerJobs.filter((job) => job.status === "pending").length;
  const approvedStudentCount = providerJobs.reduce((total, job) => {
    return total + getApprovedApplicationsForJob(job.id).length;
  }, 0);

  elements.dashboardTitle.textContent = "Provider Dashboard";
  elements.dashboardSubtitle.textContent = "Post new work and track how the department and student pipeline is moving.";

  elements.dashboardContent.innerHTML = `
    <section class="stats-grid">
      <article class="stat-card">
        <span>Total jobs</span>
        <strong>${providerJobs.length}</strong>
      </article>
      <article class="stat-card">
        <span>Approved jobs</span>
        <strong>${approvedJobs}</strong>
      </article>
      <article class="stat-card">
        <span>Pending approvals</span>
        <strong>${pendingJobs}</strong>
      </article>
      <article class="stat-card">
        <span>Approved students</span>
        <strong>${approvedStudentCount}</strong>
      </article>
    </section>

    <section class="dashboard-grid">
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>Register New Work</h2>
            <p class="section-note">Only the department head can approve and release work to students.</p>
          </div>
        </div>

        <form id="providerJobForm" class="form-grid">
          <label>
            Work title
            <input type="text" name="title" placeholder="Library catalog support" required>
          </label>
          <label>
            Work type
            <select name="workType" required>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </label>
          <label>
            Location
            <input type="text" name="location" placeholder="Pune" required>
          </label>
          <label>
            Payment amount (INR)
            <input type="number" name="pay" min="0" placeholder="500" required>
          </label>
          <label>
            Work hours
            <input type="text" name="hours" placeholder="4 hours per day" required>
          </label>
          <label>
            Number of students needed
            <input type="number" name="positions" min="1" placeholder="6" required>
          </label>
          <label class="full-width">
            Skills required
            <input type="text" name="skills" placeholder="Typing, communication, Excel">
          </label>
          <label class="full-width">
            Work description
            <textarea name="description" rows="4" placeholder="Describe the work, duration, and expectations." required></textarea>
          </label>
          <div class="full-width">
            <button class="primary-button" type="submit">Submit For Approval</button>
          </div>
        </form>
      </div>

      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>Provider Profile</h2>
            <p class="section-note">This information is attached automatically to submitted work.</p>
          </div>
        </div>
        <div class="profile-grid">
          <div><strong>Name</strong>${escapeHtml(user.name)}</div>
          <div><strong>Phone</strong>${escapeHtml(user.phone)}</div>
          <div><strong>Email</strong>${escapeHtml(user.email)}</div>
          <div><strong>Provider type</strong>${escapeHtml(user.providerType || "Not set")}</div>
          <div><strong>Organization</strong>${escapeHtml(user.organizationName || user.name)}</div>
          <div><strong>Location</strong>${escapeHtml(user.officeLocation || "Not set")}</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>Your Submitted Work</h2>
          <p class="section-note">You can monitor approval and final confirmed student count here.</p>
        </div>
      </div>
      <div class="card-list">
        ${providerJobs.length ? providerJobs.map(renderProviderJobCard).join("") : emptyStateMarkup("You have not posted any work opportunities yet.")}
      </div>
    </section>
  `;
}

function renderStudentDashboard(user) {
  const visibleJobs = state.jobs.filter((job) => job.status === "approved");
  const myApplications = state.applications
    .filter((application) => application.studentUserId === user.id)
    .map((application) => ({
      application,
      job: state.jobs.find((job) => job.id === application.jobId)
    }))
    .filter((item) => item.job);

  elements.dashboardTitle.textContent = "Student Dashboard";
  elements.dashboardSubtitle.textContent = "View approved work, apply where you are interested, and track your application status.";

  elements.dashboardContent.innerHTML = `
    <section class="stats-grid">
      <article class="stat-card">
        <span>Visible jobs</span>
        <strong>${visibleJobs.length}</strong>
      </article>
      <article class="stat-card">
        <span>Your applications</span>
        <strong>${myApplications.length}</strong>
      </article>
      <article class="stat-card">
        <span>Approved applications</span>
        <strong>${myApplications.filter((item) => item.application.status === "approved").length}</strong>
      </article>
      <article class="stat-card">
        <span>Pending decisions</span>
        <strong>${myApplications.filter((item) => item.application.status === "pending").length}</strong>
      </article>
    </section>

    <section class="dashboard-grid">
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>Your Student Profile</h2>
            <p class="section-note">This profile is shown to the department head during application approval.</p>
          </div>
        </div>
        <div class="profile-grid">
          <div><strong>Name</strong>${escapeHtml(user.name)}</div>
          <div><strong>Phone</strong>${escapeHtml(user.phone)}</div>
          <div><strong>Email</strong>${escapeHtml(user.email)}</div>
          <div><strong>Course</strong>${escapeHtml(user.course || "Not set")}</div>
          <div><strong>Residence</strong>${escapeHtml(user.residence || "Not set")}</div>
          <div><strong>Availability</strong>${escapeHtml(user.availability || "Not set")}</div>
          <div class="full-width"><strong>Skills</strong>${escapeHtml(user.skills || "Not set")}</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>Your Application Status</h2>
            <p class="section-note">Track which work is pending, approved, or rejected.</p>
          </div>
        </div>
        <div class="card-list">
          ${myApplications.length ? myApplications.map(renderStudentApplicationCard).join("") : emptyStateMarkup("You have not applied for any work yet.")}
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>Approved Work Opportunities</h2>
          <p class="section-note">Only department-approved work is visible here.</p>
        </div>
      </div>
      <div class="card-list">
        ${visibleJobs.length ? visibleJobs.map((job) => renderVisibleJobCard(job, user)).join("") : emptyStateMarkup("No approved work is available right now.")}
      </div>
    </section>
  `;
}

function renderHeadDashboard(user) {
  const pendingJobs = state.jobs.filter((job) => job.status === "pending");
  const pendingApplications = state.applications
    .filter((application) => application.status === "pending")
    .map((application) => ({
      application,
      job: state.jobs.find((job) => job.id === application.jobId),
      student: state.users.find((userItem) => userItem.id === application.studentUserId)
    }))
    .filter((item) => item.job && item.student);

  elements.dashboardTitle.textContent = "Department Head Dashboard";
  elements.dashboardSubtitle.textContent = `Manage approval flow for ${user.department || "Earn & Learn Department"} and release final student counts to providers.`;

  elements.dashboardContent.innerHTML = `
    <section class="stats-grid">
      <article class="stat-card">
        <span>Pending job approvals</span>
        <strong>${pendingJobs.length}</strong>
      </article>
      <article class="stat-card">
        <span>Pending student approvals</span>
        <strong>${pendingApplications.length}</strong>
      </article>
      <article class="stat-card">
        <span>Approved jobs</span>
        <strong>${state.jobs.filter((job) => job.status === "approved").length}</strong>
      </article>
      <article class="stat-card">
        <span>Students sent to providers</span>
        <strong>${state.applications.filter((item) => item.status === "approved").length}</strong>
      </article>
    </section>

    <section class="dashboard-grid">
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>Work Waiting For Approval</h2>
            <p class="section-note">Approve to make work visible to students, or reject if it does not fit the program.</p>
          </div>
        </div>
        <div class="card-list">
          ${pendingJobs.length ? pendingJobs.map(renderPendingJobCard).join("") : emptyStateMarkup("No work opportunities are waiting for approval.")}
        </div>
      </div>

      <div class="panel">
        <div class="panel-heading">
          <div>
            <h2>Student Applications Waiting For Approval</h2>
            <p class="section-note">Approve students to confirm them for the provider.</p>
          </div>
        </div>
        <div class="card-list">
          ${pendingApplications.length ? pendingApplications.map(renderPendingApplicationCard).join("") : emptyStateMarkup("No student applications are waiting for review.")}
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>Provider Reporting Summary</h2>
          <p class="section-note">This is the final view showing how many approved students are being sent to each provider.</p>
        </div>
      </div>
      <div class="card-list">
        ${state.jobs.length ? state.jobs.map(renderHeadSummaryCard).join("") : emptyStateMarkup("No jobs are in the system yet.")}
      </div>
    </section>
  `;
}

function renderProviderJobCard(job) {
  const approvedStudents = getApprovedApplicationsForJob(job.id)
    .map((application) => state.users.find((user) => user.id === application.studentUserId))
    .filter(Boolean);

  return `
    <article class="job-card">
      <div class="job-card-header">
        <div>
          <h3>${escapeHtml(job.title)}</h3>
          <p class="job-description">${escapeHtml(job.providerName)} | ${escapeHtml(job.location)}</p>
        </div>
        ${statusBadge(jobStatusWithCapacity(job))}
      </div>
      <div class="job-meta">
        <div><strong>Payment</strong>INR ${job.pay}</div>
        <div><strong>Hours</strong>${escapeHtml(job.hours)}</div>
        <div><strong>Work type</strong>${escapeHtml(job.workType)}</div>
        <div><strong>Students needed</strong>${job.positions}</div>
      </div>
      <p class="job-description">${escapeHtml(job.description)}</p>
      <p class="helper-text"><strong>Skills:</strong> ${escapeHtml(job.skills || "Not specified")}</p>
      <p class="helper-text"><strong>Approved students sent to provider:</strong> ${approvedStudents.length}</p>
      ${approvedStudents.length ? `<p class="application-details">${approvedStudents.map((student) => `${escapeHtml(student.name)} (${escapeHtml(student.phone)})`).join(", ")}</p>` : ""}
    </article>
  `;
}

function renderVisibleJobCard(job, studentUser) {
  const approvedCount = getApprovedApplicationsForJob(job.id).length;
  const alreadyApplied = state.applications.find(
    (application) => application.jobId === job.id && application.studentUserId === studentUser.id
  );
  const isFilled = approvedCount >= job.positions;

  return `
    <article class="job-card">
      <div class="job-card-header">
        <div>
          <h3>${escapeHtml(job.title)}</h3>
          <p class="job-description">${escapeHtml(job.providerName)} | ${escapeHtml(job.location)}</p>
        </div>
        ${statusBadge(jobStatusWithCapacity(job))}
      </div>
      <div class="job-meta">
        <div><strong>Payment</strong>INR ${job.pay}</div>
        <div><strong>Work hours</strong>${escapeHtml(job.hours)}</div>
        <div><strong>Work type</strong>${escapeHtml(job.workType)}</div>
        <div><strong>Openings</strong>${approvedCount}/${job.positions} approved</div>
      </div>
      <p class="job-description">${escapeHtml(job.description)}</p>
      <p class="helper-text"><strong>Required skills:</strong> ${escapeHtml(job.skills || "Not specified")}</p>
      <div class="card-actions">
        <button
          class="${alreadyApplied ? "secondary-button" : "primary-button"}"
          type="button"
          data-action="apply-job"
          data-id="${job.id}"
          ${alreadyApplied || isFilled ? "disabled" : ""}
        >
          ${alreadyApplied ? `Application ${capitalize(alreadyApplied.status)}` : isFilled ? "Positions Filled" : "Apply For This Work"}
        </button>
      </div>
    </article>
  `;
}

function renderStudentApplicationCard(item) {
  return `
    <article class="job-card">
      <div class="job-card-header">
        <div>
          <h3>${escapeHtml(item.job.title)}</h3>
          <p class="job-description">${escapeHtml(item.job.providerName)} | ${escapeHtml(item.job.location)}</p>
        </div>
        ${statusBadge(item.application.status)}
      </div>
      <div class="job-meta">
        <div><strong>Payment</strong>INR ${item.job.pay}</div>
        <div><strong>Hours</strong>${escapeHtml(item.job.hours)}</div>
        <div><strong>Work type</strong>${escapeHtml(item.job.workType)}</div>
        <div><strong>Applied on</strong>${formatDate(item.application.createdAt)}</div>
      </div>
    </article>
  `;
}

function renderPendingJobCard(job) {
  const provider = state.users.find((user) => user.id === job.providerUserId);

  return `
    <article class="job-card">
      <div class="job-card-header">
        <div>
          <h3>${escapeHtml(job.title)}</h3>
          <p class="job-description">${escapeHtml(job.providerName)} | ${escapeHtml(job.location)}</p>
        </div>
        ${statusBadge(job.status)}
      </div>
      <div class="job-meta">
        <div><strong>Payment</strong>INR ${job.pay}</div>
        <div><strong>Hours</strong>${escapeHtml(job.hours)}</div>
        <div><strong>Provider</strong>${escapeHtml(provider ? provider.name : job.contactName)}</div>
        <div><strong>Contact</strong>${escapeHtml(job.contactPhone)}</div>
      </div>
      <p class="job-description">${escapeHtml(job.description)}</p>
      <p class="helper-text"><strong>Skills:</strong> ${escapeHtml(job.skills || "Not specified")}</p>
      <div class="card-actions">
        <button class="primary-button" type="button" data-action="approve-job" data-id="${job.id}">Approve And Publish</button>
        <button class="danger-button" type="button" data-action="reject-job" data-id="${job.id}">Reject</button>
      </div>
    </article>
  `;
}

function renderPendingApplicationCard(item) {
  return `
    <article class="job-card">
      <div class="job-card-header">
        <div>
          <h3>${escapeHtml(item.student.name)}</h3>
          <p class="job-description">Applied for ${escapeHtml(item.job.title)}</p>
        </div>
        ${statusBadge(item.application.status)}
      </div>
      <div class="job-meta">
        <div><strong>Course</strong>${escapeHtml(item.student.course || "Not set")}</div>
        <div><strong>Residence</strong>${escapeHtml(item.student.residence || "Not set")}</div>
        <div><strong>Availability</strong>${escapeHtml(item.student.availability || "Not set")}</div>
        <div><strong>Phone</strong>${escapeHtml(item.student.phone)}</div>
      </div>
      <p class="helper-text"><strong>Skills:</strong> ${escapeHtml(item.student.skills || "Not specified")}</p>
      <div class="card-actions">
        <button class="primary-button" type="button" data-action="approve-application" data-id="${item.application.id}">Approve Student</button>
        <button class="danger-button" type="button" data-action="reject-application" data-id="${item.application.id}">Reject</button>
      </div>
    </article>
  `;
}

function renderHeadSummaryCard(job) {
  const approvedStudents = getApprovedApplicationsForJob(job.id)
    .map((application) => state.users.find((user) => user.id === application.studentUserId))
    .filter(Boolean);

  return `
    <article class="job-card">
      <div class="job-card-header">
        <div>
          <h3>${escapeHtml(job.title)}</h3>
          <p class="job-description">${escapeHtml(job.providerName)} | ${escapeHtml(job.contactEmail)}</p>
        </div>
        ${statusBadge(jobStatusWithCapacity(job))}
      </div>
      <div class="job-meta">
        <div><strong>Provider contact</strong>${escapeHtml(job.contactName)}</div>
        <div><strong>Required students</strong>${job.positions}</div>
        <div><strong>Approved students</strong>${approvedStudents.length}</div>
        <div><strong>Work location</strong>${escapeHtml(job.location)}</div>
      </div>
      <p class="helper-text">
        ${
          approvedStudents.length
            ? approvedStudents.map((student) => `${escapeHtml(student.name)} (${escapeHtml(student.phone)})`).join(", ")
            : "No students have been approved for this work yet."
        }
      </p>
    </article>
  `;
}

function jobStatusWithCapacity(job) {
  if (job.status !== "approved") return job.status;
  return getApprovedApplicationsForJob(job.id).length >= job.positions ? "filled" : "approved";
}

function showFlash(message, type) {
  elements.flashMessage.textContent = message;
  elements.flashMessage.className = `flash-message flash-${type}`;
}

function formatRole(role) {
  if (role === "head") return "Department Head";
  if (role === "provider") return "Work Provider";
  return "Student";
}

function statusBadge(status) {
  const label = status === "filled" ? "Filled" : capitalize(status);
  return `<span class="status-badge status-${status}">${label}</span>`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function emptyStateMarkup(message) {
  return `
    <div class="empty-state">
      <h3>Nothing here yet</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
