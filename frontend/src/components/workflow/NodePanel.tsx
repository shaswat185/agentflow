type NodePanelProps = {
  onAddNode: (nodeType: string) => void;
};

const NodePanel = ({ onAddNode }: NodePanelProps) => {
  const nodeTypes = [
    {
      name: "Trigger",
      description: "Start a workflow",
    },
    {
      name: "Resume Parser",
      description: "Extract resume information",
    },
    {
      name: "AI Matching",
      description: "Match candidate with a job",
    },
    {
      name: "Score Candidate",
      description: "Calculate candidate score",
    },
    {
      name: "Condition",
      description: "Create a workflow condition",
    },
    {
      name: "Email",
      description: "Send an email",
    },
  ];

  return (
    <div className="bg-white border rounded p-3 h-100">
      <h5 className="fw-bold mb-1">Add Node</h5>

      <p className="text-muted small mb-3">
        Choose a node to add to your workflow.
      </p>

      <div className="d-flex flex-column gap-2">
        {nodeTypes.map((node) => (
          <button
            key={node.name}
            type="button"
            className="btn btn-light border text-start p-3"
            onClick={() => onAddNode(node.name)}
          >
            <div className="fw-semibold">
              {node.name}
            </div>

            <small className="text-muted">
              {node.description}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodePanel;