import StatusBadge from "./StatusBadge";

function JobCard({ actions, children, job }) {
  return (
    <article className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.title}</h3>
          <p className="job-description">
            {job.providerName} | {job.location}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>
      <div className="job-meta">
        <div>
          <strong>Payment</strong>
          INR {job.pay}
        </div>
        <div>
          <strong>Hours</strong>
          {job.hours}
        </div>
        <div>
          <strong>Work type</strong>
          {job.workType}
        </div>
        <div>
          <strong>Approved / needed</strong>
          {job.approvedStudents} / {job.positions}
        </div>
      </div>
      <p className="job-description">{job.description}</p>
      <p className="helper-text">
        <strong>Skills:</strong> {job.skills || "Not specified"}
      </p>
      {children}
      {actions ? <div className="card-actions">{actions}</div> : null}
    </article>
  );
}

export default JobCard;
