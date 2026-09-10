import {
  Handle,
  Position,
  type NodeProps,
} from "reactflow";

type WorkflowNodeData = {
  label: string;
  description?: string;
  nodeType?: string;
  onDelete?: () => void;
};

const WorkflowNode = ({
  data,
}: NodeProps<WorkflowNodeData>) => {
  const isCondition = data.nodeType === "condition";

  const getNodeIcon = () => {
    switch (data.nodeType) {
      case "trigger":
        return "⚡";
      case "resume-parser":
        return "✦";
      case "job-matching":
        return "⌁";
      case "score":
        return "◈";
      case "condition":
        return "◇";
      case "shortlist":
        return "✓";
      case "reject":
        return "×";
      case "email":
        return "✉";
      default:
        return "●";
    }
  };

  const getNodeCategory = () => {
    switch (data.nodeType) {
      case "trigger":
        return "TRIGGER";
      case "resume-parser":
      case "job-matching":
      case "score":
        return "AI AGENT";
      case "condition":
        return "LOGIC";
      case "shortlist":
      case "reject":
        return "ACTION";
      case "email":
        return "COMMUNICATION";
      default:
        return "NODE";
    }
  };

  return (
    <div
      className="workflow-node"
      style={{
        width: "250px",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="workflow-handle"
      />

      <div className="workflow-node-header">
        <div className="workflow-node-icon">
          {getNodeIcon()}
        </div>

        <div className="workflow-node-category">
          {getNodeCategory()}
        </div>

        <button
          type="button"
          className="workflow-node-delete"
          onClick={(event) => {
            event.stopPropagation();
            data.onDelete?.();
          }}
          title="Delete node"
        >
          ×
        </button>
      </div>

      <div className="workflow-node-body">
        <div className="workflow-node-title">
          {data.label}
        </div>

        <div className="workflow-node-description">
          {data.description || "Workflow node"}
        </div>
      </div>

      {isCondition ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            className="workflow-handle workflow-handle-yes"
          />

          <span className="workflow-branch-label workflow-yes-label">
            YES
          </span>

          <Handle
            type="source"
            position={Position.Right}
            id="no"
            className="workflow-handle workflow-handle-no"
          />

          <span className="workflow-branch-label workflow-no-label">
            NO
          </span>
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="workflow-handle"
        />
      )}
    </div>
  );
};

export default WorkflowNode;