import { useState } from "react";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants: number;
  status: "Open" | "Closed";
  created: string;
};

const Jobs = () => {
  const [showForm, setShowForm] = useState(false);

  const jobs: Job[] = [
    {
      id: "JOB-001",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      applicants: 48,
      status: "Open",
      created: "2 days ago",
    },
    {
      id: "JOB-002",
      title: "Full-Stack Developer",
      department: "Engineering",
      location: "Delhi",
      applicants: 32,
      status: "Open",
      created: "5 days ago",
    },
    {
      id: "JOB-003",
      title: "AI Engineer",
      department: "Artificial Intelligence",
      location: "Remote",
      applicants: 21,
      status: "Open",
      created: "1 week ago",
    },
    {
      id: "JOB-004",
      title: "Product Designer",
      department: "Design",
      location: "Bangalore",
      applicants: 16,
      status: "Closed",
      created: "2 weeks ago",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Jobs</h2>
          <p className="text-muted mb-0">
            Manage job openings and candidate applications.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Create Job
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="mb-3">Create Job</h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Job Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Department
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Engineering"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Location
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Remote"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Employment Type
                </label>

                <select className="form-select">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">
                  Job Description
                </label>

                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe the role and requirements..."
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowForm(false)}
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4">Job</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-4">
                      <div className="fw-semibold">
                        {job.title}
                      </div>

                      <small className="text-muted">
                        {job.id}
                      </small>
                    </td>

                    <td>{job.department}</td>

                    <td>{job.location}</td>

                    <td>{job.applicants}</td>

                    <td>
                      <span
                        className={`badge ${
                          job.status === "Open"
                            ? "text-bg-success"
                            : "text-bg-secondary"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="text-muted">
                      {job.created}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;