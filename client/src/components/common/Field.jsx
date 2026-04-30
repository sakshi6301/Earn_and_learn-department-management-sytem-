function Field({ children, className = "", error, hint, label }) {
  return (
    <label className={className}>
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export default Field;
