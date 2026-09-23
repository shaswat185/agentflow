import type { ExecutionStep } from "../../services/workflowExecutionService";

interface ExecutionLogPanelProps {
  steps: ExecutionStep[];
  matchScore?: number | null;
  finalStatus?: "shortlisted" | "rejected" | null;
  isRunning: boolean;
}

const ExecutionLogPanel = ({
  steps,
  matchScore,
  finalStatus,
  isRunning,
}: ExecutionLogPanelProps) => {
  return (
    <div className="card border-0 shadow-sm mt-3">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">
            Execution Log
          </h6>

          <small className="text-muted">
            Workflow execution details
          </small>
        </div>

        {isRunning && (
          <span className="badge text-bg-warning">
            Running...
          </span>
        )}

        {!isRunning && finalStatus === "shortlisted" && (
          <span className="badge text-bg-success">
            Shortlisted
          </span>
        )}

        {!isRunning && finalStatus === "rejected" && (
          <span className="badge text-bg-danger">
            Rejected
          </span>
        )}
      </div>

      <div className="card-body">
        {matchScore !== null &&
          matchScore !== undefined && (
            <div className="mb-3">
              <small className="text-muted">
                AI Match Score
              </small>

              <h4 className="mb-0">
                {matchScore}%
              </h4>
            </div>
          )}

        {steps.length === 0 ? (
          <div className="text-muted small">
            No execution steps yet.
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {steps.map((step, index) => (
              <div
                key={`${step.nodeId}-${index}`}
                className="list-group-item px-0"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>
                      {step.nodeType}
                    </strong>

                    <div className="small text-muted mt-1">
                      {step.message}
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      step.status === "completed"
                        ? "text-bg-success"
                        : step.status === "failed"
                          ? "text-bg-danger"
                          : "text-bg-secondary"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionLogPanel;