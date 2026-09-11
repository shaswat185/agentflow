import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Workflow = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft";
  nodes: number;
  executions: number;
  updated: string;
};

const Workflows = () => {
  const navigate = useNavigate();

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "resume-screening",
      name: "Resume Screening",
      description: "Automatically parse, match and score candidates.",
      status: "Active",
      nodes: 9,
      executions: 1248,
      updated: "2 hours ago",
    },
    {
      id: "candidate-email",
      name: "Candidate Email",
      description: "Send automated candidate communication.",
      status: "Active",
      nodes: 4,
      executions: 824,
      updated: "Yesterday",
    },
    {
      id: "interview-scheduling",
      name: "Interview Scheduling",
      description: "Automate interview scheduling and notifications.",
      status: "Draft",
      nodes: 6,
      executions: 0,
      updated: "3 days ago",
    },
  ]);

  const handleDuplicate = (workflow: Workflow) => {
    const duplicate: Workflow = {
      ...workflow,
      id: `${workflow.id}-copy-${Date.now()}`,
      name: `${workflow.name} Copy`,
      status: "Draft",
      executions: 0,
      updated: "Just now",
    };

    setWorkflows((current) => [...current, duplicate]);
  };

  const handleDelete = (workflowId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow?"
    );

    if (!confirmed) {
      return;
    }

    setWorkflows((current) =>
      current.filter((workflow) => workflow.id !== workflowId)
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Workflows</h1>

          <p className="text-secondary mb-0">
            Build and manage your AI recruitment automations.
          </p>
        </div>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/workflows/new")}
        >
          + Create Workflow
        </button>
      </div>

      <div className="row g-4">
        {workflows.map((workflow) => (
          <div className="col-12 col-md-6 col-xl-4" key={workflow.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">{workflow.name}</h5>

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

                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-light border"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      ⋮
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            navigate(`/workflows/${workflow.id}`)
                          }
                        >
                          Edit
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDuplicate(workflow)}
                        >
                          Duplicate
                        </button>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(workflow.id)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-secondary small mb-4">
                  {workflow.description}
                </p>

                <div className="row g-3 mt-auto">
                  <div className="col-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-secondary d-block">
                        Nodes
                      </small>

                      <strong>{workflow.nodes}</strong>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-secondary d-block">
                        Executions
                      </small>

                      <strong>{workflow.executions}</strong>
                    </div>
                  </div>
                </div>

                <div className="border-top mt-4 pt-3">
                  <small className="text-secondary">
                    Updated {workflow.updated}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-5">
          <h5 className="fw-bold">No workflows</h5>

          <p className="text-secondary">
            Create your first AI recruitment workflow.
          </p>

          <button
            className="btn btn-dark"
            onClick={() => navigate("/workflows/new")}
          >
            Create Workflow
          </button>
        </div>
      )}
    </div>
  );
};

export default Workflows;