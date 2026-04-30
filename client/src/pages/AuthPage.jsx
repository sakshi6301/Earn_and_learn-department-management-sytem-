import Field from "../components/common/Field";
import FlashMessage from "../components/common/FlashMessage";
import { getRegisterSuggestion, getSignInSuggestion } from "../utils/validation";

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
        <div className="brand-panel">
          <div>
            <p className="eyebrow">Samiti Earn & Learn</p>
            <h1>Restricted MERN Workflow Portal For Providers, Students, And Department Heads</h1>
            <p className="lead">
              A cleaner flow for posting work, approving jobs, collecting student interest, and sending final approved
              student counts to the organization.
            </p>
          </div>

          <div className="flow-list">
            <article>
              <span>1</span>
              <div>
                <h2>Providers Register Work</h2>
                <p>Money, hours, work type, location, contact details, and required students are captured.</p>
              </div>
            </article>
            <article>
              <span>2</span>
              <div>
                <h2>Department Head Approves</h2>
                <p>Only approved jobs are released to students through role-restricted access.</p>
              </div>
            </article>
            <article>
              <span>3</span>
              <div>
                <h2>Students Apply</h2>
                <p>Applications return to the department head before provider confirmation.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-toggle">
            <button className={`toggle-button ${authMode === "login" ? "active" : ""}`} onClick={() => onAuthModeChange("login")} type="button">
              Sign In
            </button>
            <button className={`toggle-button ${authMode === "register" ? "active" : ""}`} onClick={() => onAuthModeChange("register")} type="button">
              Create Account
            </button>
          </div>

          {message && <FlashMessage message={message} />}

          {authMode === "login" && (
            <form className="auth-form" onSubmit={onLoginSubmit}>
              <h2>Welcome Back</h2>
              <p className="muted">Use your role account to enter the portal.</p>
              <Field error={errors.login.email} label="Email address">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => onLoginFormChange({ ...loginForm, email: event.target.value })}
                  required
                />
              </Field>
              <Field error={errors.login.password} hint="If you do not have an account yet, create one first." label="Password">
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
                  {getRegisterSuggestion()}
                </button>
                <button className="text-button" onClick={() => onAuthModeChange("resetRequest")} type="button">
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {authMode === "register" && (
            <form className="auth-form" onSubmit={onRegisterSubmit}>
              <h2>Create Role Account</h2>
              <p className="muted">After account creation, you will return to sign in with your new credentials.</p>

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
                  {getSignInSuggestion()}
                </button>
              </div>
            </form>
          )}

          {authMode === "resetRequest" && (
            <form className="auth-form" onSubmit={onRequestResetSubmit}>
              <h2>Reset Password</h2>
              <p className="muted">Enter your account email. In this development build, a reset token will be shown to you directly.</p>
              <Field error={errors.resetRequest.email} label="Account email">
                <input type="email" value={resetRequestForm.email} onChange={(event) => setResetRequestForm({ ...resetRequestForm, email: event.target.value })} required />
              </Field>
              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Generating token..." : "Get Reset Token"}
              </button>
              <div className="helper-links">
                <button className="text-button" onClick={() => onAuthModeChange("login")} type="button">
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {authMode === "resetConfirm" && (
            <form className="auth-form" onSubmit={onResetConfirmSubmit}>
              <h2>Set New Password</h2>
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
              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="demo-accounts">
            <p className="muted small">Demo accounts seeded by the backend</p>
            <ul>
              <li>Department head: head@samiti.org / head123</li>
              <li>Provider: provider@trust.org / provider123</li>
              <li>Student: student@college.edu / student123</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthPage;
