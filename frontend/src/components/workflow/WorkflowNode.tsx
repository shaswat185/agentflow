import {
  Handle,
  Position,
  type NodeProps,
} from "reactflow";

type WorkflowNodeData = {
  label: string;
  description?: string;
};

const WorkflowNode = ({
  data,
}: NodeProps<WorkflowNodeData>) => {
  return (
    <div
      className="bg-white border rounded-3 shadow-sm"
      style={{
        width: "220px",
        overflow: "visible",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "10px",
          height: "10px",
        }}
      />

      <div className="p-3">
        <div className="fw-semibold mb-1">
          {data.label}
        </div>

        <small className="text-muted">
          {data.description || "Workflow node"}
        </small>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
};

export default WorkflowNode;