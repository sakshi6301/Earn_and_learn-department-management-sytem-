import Field from "./Field";

function PasswordPanel({ errors, form, onChange, onSubmit, title = "Change Password" }) {
  return (
    <div className="panel panel-stack">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p className="section-note">Use a password with at least 6 characters.</p>
        </div>
      </div>
      <form className="form-grid" onSubmit={onSubmit}>
        <Field error={errors.currentPassword} label="Current password">
          <input
            type="password"
            value={form.currentPassword}
            onChange={(event) => onChange({ ...form, currentPassword: event.target.value })}
            required
          />
        </Field>
        <Field error={errors.newPassword} label="New password">
          <input
            type="password"
            value={form.newPassword}
            onChange={(event) => onChange({ ...form, newPassword: event.target.value })}
            required
          />
        </Field>
        <Field className="full-width" error={errors.confirmPassword} label="Confirm new password">
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => onChange({ ...form, confirmPassword: event.target.value })}
            required
          />
        </Field>
        <div className="full-width inline-actions">
          <button className="secondary-button" type="submit">
            Save New Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordPanel;
