import { useNavigate } from "react-router-dom";

const Workflows = () => {
  const navigate = useNavigate();

  const workflows = [
    {
      name: "Resume Screening",
      description: "Automatically analyze and score candidate resumes.",
      status: "Active",
      executions: 248,
      updated: "2 hours ago",
    },
    {
      name: "Candidate Matching",
      description: "Match candidates with suitable job requirements.",
      status: "Active",
      executions: 186,
      updated: "5 hours ago",
    },
    {
      name: "Interview Scheduling",
      description: "Automatically schedule interviews with candidates.",
      status: "Inactive",
      executions: 94,
      updated: "Yesterday",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Workflows</h2>

          <p className="text-muted mb-0">
            Build and manage your AI recruitment workflows.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/workflows/new")}
        >
          + Create Workflow
        </button>
      </div>

      <div className="row g-4">
        {workflows.map((workflow) => (
          <div
            className="col-12 col-lg-6 col-xl-4"
            key={workflow.name}
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="fw-bold mb-0">
                    {workflow.name}
                  </h5>

                  <span
                    className={`badge ${
                      workflow.status === "Active"
                        ? "text-bg-success"
                        : "text-bg-secondary"
                    }`}
                  >
                    {workflow.status}
                  </span>
                </div>

                <p className="text-muted">
                  {workflow.description}
                </p>

                <div className="border-top pt-3 mt-4">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">
                      Executions
                    </span>

                    <span className="fw-semibold">
                      {workflow.executions}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    <span className="text-muted">
                      Updated
                    </span>

                    <span className="fw-semibold">
                      {workflow.updated}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-outline-primary w-100 mt-4"
                  onClick={() =>
                    navigate("/workflows/new")
                  }
                >
                  Open Workflow
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="col-12 col-lg-6 col-xl-4">
          <button
            className="card border-2 border-dashed bg-transparent w-100 h-100"
            style={{ minHeight: "280px" }}
            onClick={() => navigate("/workflows/new")}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <div className="fs-1 text-primary mb-2">+</div>

              <h5 className="fw-bold">
                Create a new workflow
              </h5>

              <p className="text-muted mb-0">
                Start building your AI automation.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workflows;