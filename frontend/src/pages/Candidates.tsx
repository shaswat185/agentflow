import { useState } from "react";

type Candidate = {
  id: string;
  name: string;
  email: string;
  job: string;
  experience: string;
  score: number;
  status: "Shortlisted" | "Review" | "Rejected";
};

const Candidates = () => {
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const candidates: Candidate[] = [
    {
      id: "CAN-001",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      job: "Frontend Developer",
      experience: "4 years",
      score: 92,
      status: "Shortlisted",
    },
    {
      id: "CAN-002",
      name: "Priya Mehta",
      email: "priya@example.com",
      job: "Full-Stack Developer",
      experience: "3 years",
      score: 86,
      status: "Shortlisted",
    },
    {
      id: "CAN-003",
      name: "Rahul Verma",
      email: "rahul@example.com",
      job: "AI Engineer",
      experience: "2 years",
      score: 74,
      status: "Review",
    },
    {
      id: "CAN-004",
      name: "Neha Kapoor",
      email: "neha@example.com",
      job: "Frontend Developer",
      experience: "1 year",
      score: 61,
      status: "Rejected",
    },
  ];

  const getScoreClass = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-danger";
  };

  const getStatusClass = (status: Candidate["status"]) => {
    if (status === "Shortlisted") return "text-bg-success";
    if (status === "Review") return "text-bg-warning";
    return "text-bg-danger";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Candidates</h2>
          <p className="text-muted mb-0">
            Review applicants and AI-powered screening results.
          </p>
        </div>

        <div className="text-muted small">
          {candidates.length} applicants
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4">Candidate</th>
                  <th>Job</th>
                  <th>Experience</th>
                  <th>AI Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-4">
                      <div className="fw-semibold">
                        {candidate.name}
                      </div>

                      <small className="text-muted">
                        {candidate.email}
                      </small>
                    </td>

                    <td>{candidate.job}</td>

                    <td>{candidate.experience}</td>

                    <td>
                      <div
                        className={`fw-bold ${getScoreClass(
                          candidate.score
                        )}`}
                      >
                        {candidate.score}/100
                      </div>

                      <div
                        className="progress mt-1"
                        style={{ width: "90px", height: "5px" }}
                      >
                        <div
                          className={`progress-bar ${
                            candidate.score >= 80
                              ? "bg-success"
                              : candidate.score >= 70
                                ? "bg-warning"
                                : "bg-danger"
                          }`}
                          style={{
                            width: `${candidate.score}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusClass(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setSelectedCandidate(candidate)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h5 className="mb-1">
                  {selectedCandidate.name}
                </h5>

                <small className="text-muted">
                  {selectedCandidate.id}
                </small>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => setSelectedCandidate(null)}
              >
                Close
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    Email
                  </small>
                  <strong>{selectedCandidate.email}</strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    Applied Position
                  </small>
                  <strong>{selectedCandidate.job}</strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    Experience
                  </small>
                  <strong>
                    {selectedCandidate.experience}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    AI Screening Score
                  </small>

                  <strong
                    className={getScoreClass(
                      selectedCandidate.score
                    )}
                  >
                    {selectedCandidate.score}/100
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h6>AI Screening Result</h6>

              <p className="text-muted mb-0">
                Candidate profile was evaluated against the
                selected job requirements. The AI score represents
                the current match quality based on skills,
                experience, and job requirements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;