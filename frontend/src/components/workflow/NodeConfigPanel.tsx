import type { Node } from "reactflow";

type NodeConfigPanelProps = {
  node: Node | null;
};

const NodeConfigPanel = ({
  node,
}: NodeConfigPanelProps) => {
  if (!node) {
    return (
      <div className="bg-white border rounded-3 shadow-sm p-4 h-100">
        <h5 className="fw-bold mb-2">
          Node Configuration
        </h5>

        <p className="text-muted mb-0">
          Select a node to configure it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-3 shadow-sm p-4 h-100">
      <h5 className="fw-bold mb-4">
        Node Configuration
      </h5>

      <div className="mb-3">
        <label
          htmlFor="node-name"
          className="form-label fw-semibold"
        >
          Node Name
        </label>

        <input
          id="node-name"
          type="text"
          className="form-control"
          value={node.data.label}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label
          htmlFor="node-description"
          className="form-label fw-semibold"
        >
          Description
        </label>

        <textarea
          id="node-description"
          className="form-control"
          rows={4}
          value={node.data.description || ""}
          readOnly
        />
      </div>

      <div className="border-top pt-3">
        <small className="text-muted">
          Node ID
        </small>

        <div className="small fw-semibold mt-1 text-break">
          {node.id}
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;