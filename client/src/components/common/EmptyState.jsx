function EmptyState({ message }) {
  return (
    <article className="job-card empty-card">
      <h3>Nothing here yet</h3>
      <p className="job-description">{message}</p>
    </article>
  );
}

export default EmptyState;
