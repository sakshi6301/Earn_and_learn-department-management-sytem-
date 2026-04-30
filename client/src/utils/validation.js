export function createEmptyRegisterForm() {
  return {
    role: "provider",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    providerType: "Organization",
    officeLocation: "",
    course: "",
    residence: "",
    skills: "",
    availability: "",
    department: ""
  };
}

export function createEmptyResetRequestForm() {
  return { email: "" };
}

export function createEmptyResetConfirmForm() {
  return {
    email: "",
    resetToken: "",
    newPassword: "",
    confirmPassword: ""
  };
}

export function createEmptyChangePasswordForm() {
  return {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
}

export function createEmptyJobForm() {
  return {
    title: "",
    workType: "On-site",
    location: "",
    pay: "",
    hours: "",
    positions: "",
    skills: "",
    description: ""
  };
}

export function profileFromUser(user) {
  return {
    name: user.name || "",
    phone: user.phone || "",
    organizationName: user.organizationName || "",
    providerType: user.providerType || "Organization",
    officeLocation: user.officeLocation || "",
    course: user.course || "",
    residence: user.residence || "",
    skills: user.skills || "",
    availability: user.availability || "",
    department: user.department || ""
  };
}

export function validateLoginForm(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.password.trim()) errors.password = "Password is required.";
  return errors;
}

export function validateRegisterForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.password) errors.password = "Password is required.";
  if (form.password && form.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (!form.confirmPassword) errors.confirmPassword = "Please confirm the password.";
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (form.role === "provider") {
    if (!form.organizationName.trim()) errors.organizationName = "Organization name is required.";
    if (!form.officeLocation.trim()) errors.officeLocation = "Office location is required.";
  }

  if (form.role === "student") {
    if (!form.course.trim()) errors.course = "Course / year is required.";
    if (!form.residence.trim()) errors.residence = "Hostel / area is required.";
    if (!form.skills.trim()) errors.skills = "Skills are required.";
    if (!form.availability.trim()) errors.availability = "Availability is required.";
  }

  if (form.role === "head" && !form.department.trim()) {
    errors.department = "Department name is required.";
  }

  return errors;
}

export function validateResetRequestForm(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  return errors;
}

export function validateResetConfirmForm(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.resetToken.trim()) errors.resetToken = "Reset token is required.";
  if (!form.newPassword) errors.newPassword = "New password is required.";
  if (form.newPassword && form.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters.";
  if (!form.confirmPassword) errors.confirmPassword = "Please confirm the new password.";
  if (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export function validateChangePassword(form) {
  const errors = {};
  if (!form.currentPassword) errors.currentPassword = "Current password is required.";
  if (!form.newPassword) errors.newPassword = "New password is required.";
  if (form.newPassword && form.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters.";
  if (!form.confirmPassword) errors.confirmPassword = "Please confirm the new password.";
  if (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export function validateProfileForm(role, form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = "Full name is required.";
  if (!form.phone?.trim()) errors.phone = "Phone number is required.";

  if (role === "provider") {
    if (!form.organizationName?.trim()) errors.organizationName = "Organization name is required.";
    if (!form.officeLocation?.trim()) errors.officeLocation = "Office location is required.";
  }

  if (role === "student") {
    if (!form.course?.trim()) errors.course = "Course / year is required.";
    if (!form.residence?.trim()) errors.residence = "Hostel / area is required.";
    if (!form.skills?.trim()) errors.skills = "Skills are required.";
    if (!form.availability?.trim()) errors.availability = "Availability is required.";
  }

  if (role === "head" && !form.department?.trim()) errors.department = "Department name is required.";

  return errors;
}

export function validateJobForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Work title is required.";
  if (!form.location.trim()) errors.location = "Location is required.";
  if (!form.pay || Number(form.pay) <= 0) errors.pay = "Payment amount must be greater than zero.";
  if (!form.hours.trim()) errors.hours = "Work hours are required.";
  if (!form.positions || Number(form.positions) <= 0) errors.positions = "Student count must be greater than zero.";
  if (!form.description.trim()) errors.description = "Work description is required.";
  return errors;
}

export function getRegisterSuggestion() {
  return "If you don't have an account, create one.";
}

export function getSignInSuggestion() {
  return "Already have an account? Sign in.";
}
