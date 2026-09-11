import { useState } from "react";

type Execution = {
  id: string;
  workflow: string;
  status: "Completed" | "Failed";
  duration: string;
  started: string;
};

const Executions = () => {
  const [selectedExecution, setSelectedExecution] =
    useState<Execution | null>(null);

  const executions: Execution[] = [
    {
      id: "EXE-001",
      workflow: "Candidate Screening",
      status: "Completed",
      duration: "12.4s",
      started: "Just now",
    },
    {
      id: "EXE-002",
      workflow: "Resume Processing",
      status: "Completed",
      duration: "8.7s",
      started: "10 min ago",
    },
    {
      id: "EXE-003",
      workflow: "Candidate Evaluation",
      status: "Failed",
      duration: "4.2s",
      started: "32 min ago",
    },
  ];

  const executionSteps = [
    {
      name: "Trigger",
      status: "Completed",
      duration: "0.4s",
    },
    {
      name: "Resume Parser AI",
      status: "Completed",
      duration: "2.8s",
    },
    {
      name: "Job Matching",
      status: "Completed",
      duration: "3.1s",
    },
    {
      name: "Candidate Score",
      status: "Completed",
      duration: "2.2s",
    },
    {
      name: "Condition",
      status: "Completed",
      duration: "0.6s",
    },
    {
      name: "Shortlist",
      status: "Completed",
      duration: "0.8s",
    },
    {
      name: "Reject",
      status: "Skipped",
      duration: "-",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Executions</h2>
          <p className="text-muted mb-0">
            Monitor workflow execution history and results.
          </p>
        </div>

        <button type="button" className="btn btn-outline-secondary">
          Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4">Execution</th>
                  <th>Workflow</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Started</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {executions.map((execution) => (
                  <tr key={execution.id}>
                    <td className="px-4 fw-semibold">
                      {execution.id}
                    </td>

                    <td>{execution.workflow}</td>

                    <td>
                      <span
                        className={`badge ${
                          execution.status === "Completed"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {execution.status}
                      </span>
                    </td>

                    <td>{execution.duration}</td>

                    <td className="text-muted">
                      {execution.started}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setSelectedExecution(execution)
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

      {selectedExecution && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h5 className="mb-1">
                  {selectedExecution.id}
                </h5>

                <div className="text-muted small">
                  {selectedExecution.workflow}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => setSelectedExecution(null)}
              >
                Close
              </button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    Status
                  </small>

                  <strong>
                    {selectedExecution.status}
                  </strong>
                </div>
              </div>

              <div className="col-md-4">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    Duration
                  </small>

                  <strong>
                    {selectedExecution.duration}
                  </strong>
                </div>
              </div>

              <div className="col-md-4">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block">
                    Started
                  </small>

                  <strong>
                    {selectedExecution.started}
                  </strong>
                </div>
              </div>
            </div>

            <h6 className="mb-3">Execution Steps</h6>

            <div>
              {executionSteps.map((step, index) => (
                <div
                  key={step.name}
                  className="d-flex align-items-center gap-3 py-3 border-bottom"
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                      step.status === "Completed"
                        ? "bg-success-subtle text-success"
                        : "bg-secondary-subtle text-secondary"
                    }`}
                    style={{
                      width: "32px",
                      height: "32px",
                    }}
                  >
                    {step.status === "Completed" ? "✓" : "−"}
                  </div>

                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      {index + 1}. {step.name}
                    </div>

                    <small className="text-muted">
                      {step.status}
                    </small>
                  </div>

                  <small className="text-muted">
                    {step.duration}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Executions;