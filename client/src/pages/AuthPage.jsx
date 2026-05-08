import Field from "../components/common/Field";
import FlashMessage from "../components/common/FlashMessage";
import Modal from "../components/common/Modal";

function AuthPage({
  authMode,
  errors,
  loading,
  loginForm,
  message,
  onAuthModeChange,
  onLoginFormChange,
  onLoginSubmit,
  onRegisterFormChange,
  onRegisterSubmit,
  onRequestResetSubmit,
  onResetConfirmSubmit,
  registerForm,
  resetConfirmForm,
  resetRequestForm,
  setResetConfirmForm,
  setResetRequestForm
}) {
  return (
    <div className="page-shell">
      <section className="auth-screen">
        <div className="brand-panel auth-intro-panel">
          <div className="auth-intro-copy">
            <p className="eyebrow">Samiti Earn & Learn</p>
            <h1>Simple role-based access for providers, students, and department heads.</h1>
            <p className="lead">Create your account, sign in, and continue your work from the correct dashboard.</p>
          </div>

          <div className="auth-role-list" aria-label="Portal roles">
            <article className="auth-role-card">
              <strong>Work Provider</strong>
              <p>Post work opportunities and manage approved student support.</p>
            </article>
            <article className="auth-role-card">
              <strong>Student</strong>
              <p>See approved work, apply, and track your progress in one place.</p>
            </article>
            <article className="auth-role-card">
              <strong>Department Head</strong>
              <p>Approve jobs, review applications, and keep records consistent.</p>
            </article>
          </div>
        </div>

        <div className="auth-panel auth-card-panel">
          <div className="auth-card-header">
            <p className="eyebrow">Access Portal</p>
            <h2>{authMode === "register" ? "Create your account" : "Sign in to continue"}</h2>
            <p className="muted">
              {authMode === "register"
                ? "Choose your role and fill in the required details."
                : "Use your registered email and password."}
            </p>
          </div>

          <div className="auth-toggle">
            <button
              className={`toggle-button ${authMode === "login" ? "active" : ""}`}
              onClick={() => onAuthModeChange("login")}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`toggle-button ${authMode === "register" ? "active" : ""}`}
              onClick={() => onAuthModeChange("register")}
              type="button"
            >
              Create Account
            </button>
          </div>

          {message && <FlashMessage message={message} />}

          {authMode === "login" && (
            <form className="auth-form" onSubmit={onLoginSubmit}>
              <div className="auth-form-heading">
                <h3>Welcome back</h3>
                <p className="muted compact">Use your role account to enter the portal.</p>
              </div>
              <Field error={errors.login.email} label="Email address">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => onLoginFormChange({ ...loginForm, email: event.target.value })}
                  required
                />
              </Field>
              <Field error={errors.login.password} label="Password">
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => onLoginFormChange({ ...loginForm, password: event.target.value })}
                  required
                />
              </Field>
              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Login"}
              </button>
              <div className="helper-links">
                <button className="text-button" onClick={() => onAuthModeChange("register")} type="button">
                  Don't have an account? Create one.
                </button>
                <button className="text-button" onClick={() => onAuthModeChange("resetRequest")} type="button">
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {authMode === "register" && (
            <form className="auth-form" onSubmit={onRegisterSubmit}>
              <div className="auth-form-heading">
                <h3>Create account</h3>
                <p className="muted compact">After account creation, you will return to sign in.</p>
              </div>

              <Field label="Register as">
                <select value={registerForm.role} onChange={(event) => onRegisterFormChange({ ...registerForm, role: event.target.value })}>
                  <option value="provider">Work Provider</option>
                  <option value="student">Student</option>
                  <option value="head">Department Head</option>
                </select>
              </Field>

              <div className="form-grid">
                <Field error={errors.register.name} label="Full name">
                  <input value={registerForm.name} onChange={(event) => onRegisterFormChange({ ...registerForm, name: event.target.value })} required />
                </Field>
                <Field error={errors.register.phone} label="Phone number">
                  <input value={registerForm.phone} onChange={(event) => onRegisterFormChange({ ...registerForm, phone: event.target.value })} required />
                </Field>
                <Field className="full-width" error={errors.register.email} label="Email address">
                  <input type="email" value={registerForm.email} onChange={(event) => onRegisterFormChange({ ...registerForm, email: event.target.value })} required />
                </Field>
                <Field error={errors.register.password} label="Password">
                  <input type="password" minLength="6" value={registerForm.password} onChange={(event) => onRegisterFormChange({ ...registerForm, password: event.target.value })} required />
                </Field>
                <Field error={errors.register.confirmPassword} label="Confirm password">
                  <input type="password" minLength="6" value={registerForm.confirmPassword} onChange={(event) => onRegisterFormChange({ ...registerForm, confirmPassword: event.target.value })} required />
                </Field>

                {registerForm.role === "provider" && (
                  <>
                    <Field className="full-width" error={errors.register.organizationName} label="Organization or provider name">
                      <input value={registerForm.organizationName} onChange={(event) => onRegisterFormChange({ ...registerForm, organizationName: event.target.value })} required />
                    </Field>
                    <Field error={errors.register.providerType} label="Provider type">
                      <select value={registerForm.providerType} onChange={(event) => onRegisterFormChange({ ...registerForm, providerType: event.target.value })}>
                        <option value="Organization">Organization</option>
                        <option value="Person">Person</option>
                      </select>
                    </Field>
                    <Field error={errors.register.officeLocation} label="Office location">
                      <input value={registerForm.officeLocation} onChange={(event) => onRegisterFormChange({ ...registerForm, officeLocation: event.target.value })} required />
                    </Field>
                  </>
                )}

                {registerForm.role === "student" && (
                  <>
                    <Field error={errors.register.course} label="Course / year">
                      <input value={registerForm.course} onChange={(event) => onRegisterFormChange({ ...registerForm, course: event.target.value })} required />
                    </Field>
                    <Field error={errors.register.residence} label="Hostel / area">
                      <input value={registerForm.residence} onChange={(event) => onRegisterFormChange({ ...registerForm, residence: event.target.value })} required />
                    </Field>
                    <Field className="full-width" error={errors.register.skills} label="Skills">
                      <input value={registerForm.skills} onChange={(event) => onRegisterFormChange({ ...registerForm, skills: event.target.value })} required />
                    </Field>
                    <Field className="full-width" error={errors.register.availability} label="Availability">
                      <input value={registerForm.availability} onChange={(event) => onRegisterFormChange({ ...registerForm, availability: event.target.value })} required />
                    </Field>
                  </>
                )}

                {registerForm.role === "head" && (
                  <Field className="full-width" error={errors.register.department} label="Department name">
                    <input value={registerForm.department} onChange={(event) => onRegisterFormChange({ ...registerForm, department: event.target.value })} required />
                  </Field>
                )}
              </div>

              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div className="helper-links">
                <button className="text-button" onClick={() => onAuthModeChange("login")} type="button">
                  Already have an account? Sign in.
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {authMode === "resetRequest" ? (
        <Modal onClose={() => onAuthModeChange("login")} title="Reset Password">
          <form className="auth-form" onSubmit={onRequestResetSubmit}>
            <p className="muted">Enter your account email to get a reset token in this development build.</p>
            <Field error={errors.resetRequest.email} label="Account email">
              <input type="email" value={resetRequestForm.email} onChange={(event) => setResetRequestForm({ ...resetRequestForm, email: event.target.value })} required />
            </Field>
            <div className="helper-links">
              <button className="text-button" onClick={() => onAuthModeChange("login")} type="button">
                Back to sign in
              </button>
            </div>
            <div className="inline-actions">
              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Generating token..." : "Get Reset Token"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {authMode === "resetConfirm" ? (
        <Modal onClose={() => onAuthModeChange("login")} title="Set New Password">
          <form className="auth-form" onSubmit={onResetConfirmSubmit}>
            <p className="muted">Use the reset token you received and choose a new password.</p>
            <Field error={errors.resetConfirm.email} label="Account email">
              <input type="email" value={resetConfirmForm.email} onChange={(event) => setResetConfirmForm({ ...resetConfirmForm, email: event.target.value })} required />
            </Field>
            <Field error={errors.resetConfirm.resetToken} label="Reset token">
              <input value={resetConfirmForm.resetToken} onChange={(event) => setResetConfirmForm({ ...resetConfirmForm, resetToken: event.target.value.toUpperCase() })} required />
            </Field>
            <Field error={errors.resetConfirm.newPassword} label="New password">
              <input type="password" value={resetConfirmForm.newPassword} onChange={(event) => setResetConfirmForm({ ...resetConfirmForm, newPassword: event.target.value })} required />
            </Field>
            <Field error={errors.resetConfirm.confirmPassword} label="Confirm new password">
              <input type="password" value={resetConfirmForm.confirmPassword} onChange={(event) => setResetConfirmForm({ ...resetConfirmForm, confirmPassword: event.target.value })} required />
            </Field>
            <div className="inline-actions">
              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

export default AuthPage;
