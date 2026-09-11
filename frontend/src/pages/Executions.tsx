import { useEffect, useMemo, useState } from "react";

type ExecutionStatus = "Completed" | "Running" | "Failed";

type ExecutionNode = {
  id: string;
  name: string;
  status: "Completed" | "Skipped" | "Failed";
};

type Execution = {
  id: string;
  workflow: string;
  candidate: string;
  score: number;
  status: ExecutionStatus;
  duration: string;
  startedAt: string;
  nodes: ExecutionNode[];
};

const STORAGE_KEY = "agentflow-executions";

const initialExecutions: Execution[] = [
  {
    id: "exec-1001",
    workflow: "Resume Screening",
    candidate: "Rahul Sharma",
    score: 92,
    status: "Completed",
    duration: "4.8s",
    startedAt: "Today, 2:42 PM",
    nodes: [
      {
        id: "trigger",
        name: "Trigger",
        status: "Completed",
      },
      {
        id: "resume-parser",
        name: "Resume Parser AI",
        status: "Completed",
      },
      {
        id: "job-matching",
        name: "Job Matching",
        status: "Completed",
      },
      {
        id: "candidate-score",
        name: "Candidate Score",
        status: "Completed",
      },
      {
        id: "condition",
        name: "Condition",
        status: "Completed",
      },
      {
        id: "shortlist",
        name: "Shortlist",
        status: "Completed",
      },
      {
        id: "send-email",
        name: "Send Email",
        status: "Completed",
      },
    ],
  },
  {
    id: "exec-1002",
    workflow: "Resume Screening",
    candidate: "Priya Singh",
    score: 84,
    status: "Completed",
    duration: "4.2s",
    startedAt: "Today, 1:18 PM",
    nodes: [
      {
        id: "trigger",
        name: "Trigger",
        status: "Completed",
      },
      {
        id: "resume-parser",
        name: "Resume Parser AI",
        status: "Completed",
      },
      {
        id: "job-matching",
        name: "Job Matching",
        status: "Completed",
      },
      {
        id: "candidate-score",
        name: "Candidate Score",
        status: "Completed",
      },
      {
        id: "condition",
        name: "Condition",
        status: "Completed",
      },
      {
        id: "shortlist",
        name: "Shortlist",
        status: "Completed",
      },
      {
        id: "send-email",
        name: "Send Email",
        status: "Completed",
      },
    ],
  },
  {
    id: "exec-1003",
    workflow: "Candidate Email",
    candidate: "Aman Verma",
    score: 68,
    status: "Completed",
    duration: "2.7s",
    startedAt: "Yesterday, 5:36 PM",
    nodes: [
      {
        id: "trigger",
        name: "Trigger",
        status: "Completed",
      },
      {
        id: "candidate-email",
        name: "Candidate Email",
        status: "Completed",
      },
      {
        id: "email",
        name: "Send Email",
        status: "Completed",
      },
    ],
  },
  {
    id: "exec-1004",
    workflow: "Resume Screening",
    candidate: "Vikas Kumar",
    score: 54,
    status: "Failed",
    duration: "1.9s",
    startedAt: "Yesterday, 3:21 PM",
    nodes: [
      {
        id: "trigger",
        name: "Trigger",
        status: "Completed",
      },
      {
        id: "resume-parser",
        name: "Resume Parser AI",
        status: "Failed",
      },
      {
        id: "job-matching",
        name: "Job Matching",
        status: "Skipped",
      },
      {
        id: "candidate-score",
        name: "Candidate Score",
        status: "Skipped",
      },
    ],
  },
];

const Executions = () => {
  const [executions, setExecutions] =
    useState<Execution[]>(initialExecutions);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [workflowFilter, setWorkflowFilter] = useState("All");

  const [selectedExecution, setSelectedExecution] =
    useState<Execution | null>(null);

  useEffect(() => {
    const savedExecutions = localStorage.getItem(STORAGE_KEY);

    if (!savedExecutions) return;

    try {
      const parsed = JSON.parse(savedExecutions);

      if (Array.isArray(parsed)) {
        setExecutions(parsed);
      }
    } catch (error) {
      console.error("Failed to load executions:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(executions)
    );
  }, [executions]);

  const workflows = useMemo(() => {
    return Array.from(
      new Set(executions.map((execution) => execution.workflow))
    );
  }, [executions]);

  const filteredExecutions = useMemo(() => {
    return executions.filter((execution) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        execution.id.toLowerCase().includes(searchValue) ||
        execution.workflow.toLowerCase().includes(searchValue) ||
        execution.candidate.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        execution.status === statusFilter;

      const matchesWorkflow =
        workflowFilter === "All" ||
        execution.workflow === workflowFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesWorkflow
      );
    });
  }, [
    executions,
    search,
    statusFilter,
    workflowFilter,
  ]);

  const completedCount = executions.filter(
    (execution) => execution.status === "Completed"
  ).length;

  const runningCount = executions.filter(
    (execution) => execution.status === "Running"
  ).length;

  const failedCount = executions.filter(
    (execution) => execution.status === "Failed"
  ).length;

  const getStatusClass = (status: ExecutionStatus) => {
    if (status === "Completed") {
      return "bg-success-subtle text-success";
    }

    if (status === "Running") {
      return "bg-primary-subtle text-primary";
    }

    return "bg-danger-subtle text-danger";
  };

  const getNodeStatusClass = (
    status: ExecutionNode["status"]
  ) => {
    if (status === "Completed") {
      return "text-success";
    }

    if (status === "Skipped") {
      return "text-secondary";
    }

    return "text-danger";
  };

  const clearExecutionHistory = () => {
    const confirmed = window.confirm(
      "Clear all execution history?"
    );

    if (!confirmed) return;

    setExecutions([]);
    setSelectedExecution(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Executions</h2>

          <p className="text-secondary mb-0">
            Monitor workflow runs and execution history.
          </p>
        </div>

        {executions.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={clearExecutionHistory}
          >
            Clear History
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Total Executions
              </div>

              <div className="fs-3 fw-bold mt-1">
                {executions.length}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Completed
              </div>

              <div className="fs-3 fw-bold mt-1 text-success">
                {completedCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Running
              </div>

              <div className="fs-3 fw-bold mt-1 text-primary">
                {runningCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Failed
              </div>

              <div className="fs-3 fw-bold mt-1 text-danger">
                {failedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search execution, workflow or candidate..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Running">Running</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <select
                className="form-select"
                value={workflowFilter}
                onChange={(event) =>
                  setWorkflowFilter(event.target.value)
                }
              >
                <option value="All">All Workflows</option>

                {workflows.map((workflow) => (
                  <option
                    key={workflow}
                    value={workflow}
                  >
                    {workflow}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTION TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-1">Execution History</h5>

          <div className="small text-secondary">
            {filteredExecutions.length} execution
            {filteredExecutions.length !== 1
              ? "s"
              : ""}
          </div>
        </div>

        {filteredExecutions.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div className="fs-1 mb-2">⚡</div>

            <h5>No executions found</h5>

            <p className="text-secondary mb-0">
              Run a workflow to see its execution history
              here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Execution</th>
                  <th>Workflow</th>
                  <th>Candidate</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Started</th>
                  <th className="text-end pe-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredExecutions.map((execution) => (
                  <tr key={execution.id}>
                    <td className="ps-4">
                      <span className="fw-semibold">
                        #{execution.id.replace("exec-", "")}
                      </span>
                    </td>

                    <td>
                      <span className="fw-medium">
                        {execution.workflow}
                      </span>
                    </td>

                    <td>{execution.candidate}</td>

                    <td>
                      <span
                        className={`fw-bold ${
                          execution.score >= 80
                            ? "text-success"
                            : execution.score >= 60
                              ? "text-warning"
                              : "text-danger"
                        }`}
                      >
                        {execution.score}
                      </span>
                      <span className="text-secondary">
                        /100
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusClass(
                          execution.status
                        )}`}
                      >
                        {execution.status}
                      </span>
                    </td>

                    <td>{execution.duration}</td>

                    <td className="text-secondary">
                      {execution.startedAt}
                    </td>

                    <td className="text-end pe-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setSelectedExecution(
                            execution
                          )
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
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedExecution && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">
                    Execution #
                    {selectedExecution.id.replace(
                      "exec-",
                      ""
                    )}
                  </h5>

                  <div className="small text-secondary">
                    {selectedExecution.workflow}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setSelectedExecution(null)
                  }
                />
              </div>

              <div className="modal-body">
                {/* SUMMARY */}
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="border rounded p-3 h-100">
                      <div className="small text-secondary">
                        Candidate
                      </div>

                      <div className="fw-semibold mt-1">
                        {selectedExecution.candidate}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="border rounded p-3 h-100">
                      <div className="small text-secondary">
                        Score
                      </div>

                      <div className="fw-semibold mt-1">
                        {selectedExecution.score}/100
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="border rounded p-3 h-100">
                      <div className="small text-secondary">
                        Status
                      </div>

                      <div className="mt-1">
                        <span
                          className={`badge ${getStatusClass(
                            selectedExecution.status
                          )}`}
                        >
                          {selectedExecution.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="border rounded p-3 h-100">
                      <div className="small text-secondary">
                        Duration
                      </div>

                      <div className="fw-semibold mt-1">
                        {selectedExecution.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* NODE EXECUTION */}
                <h6 className="fw-bold mb-3">
                  Node Execution
                </h6>

                <div className="border rounded">
                  {selectedExecution.nodes.map(
                    (node, index) => (
                      <div
                        key={node.id}
                        className={`d-flex align-items-center gap-3 p-3 ${
                          index <
                          selectedExecution.nodes.length - 1
                            ? "border-bottom"
                            : ""
                        }`}
                      >
                        <div
                          className={`fs-5 ${getNodeStatusClass(
                            node.status
                          )}`}
                        >
                          {node.status ===
                            "Completed" && "✓"}

                          {node.status ===
                            "Skipped" && "–"}

                          {node.status === "Failed" &&
                            "!"}
                        </div>

                        <div className="flex-grow-1">
                          <div className="fw-semibold">
                            {node.name}
                          </div>

                          <div className="small text-secondary">
                            {node.status}
                          </div>
                        </div>

                        <span
                          className={`small fw-semibold ${getNodeStatusClass(
                            node.status
                          )}`}
                        >
                          {node.status}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    setSelectedExecution(null)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Executions;