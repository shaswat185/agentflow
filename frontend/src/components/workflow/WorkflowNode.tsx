import { Handle, Position, type NodeProps } from "reactflow";

const WorkflowNode = ({ data }: NodeProps) => {
  const isCondition = data.nodeType === "condition";

  const executionStatus = data.executionStatus ?? "idle";

  return (
    <div
      className={`workflow-node workflow-node-${data.nodeType} workflow-node-status-${executionStatus}`}
    >
      {/* INPUT */}

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="workflow-handle workflow-input-handle"
      />

      {/* HEADER */}

      <div className="workflow-node-header">
        <div className="workflow-node-icon">
          {data.nodeType === "trigger" && "⚡"}
          {data.nodeType === "resume-parser" && "AI"}
          {data.nodeType === "job-matching" && "↔"}
          {data.nodeType === "score" && "★"}
          {data.nodeType === "condition" && "◇"}
          {data.nodeType === "shortlist" && "✓"}
          {data.nodeType === "reject" && "×"}
          {data.nodeType === "email" && "✉"}
        </div>

        <div className="workflow-node-title">
          {data.label}
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

      {/* BODY */}

      <div className="workflow-node-body">
        <p className="workflow-node-description">
          {data.description}
        </p>

        {data.nodeType === "condition" && (
          <>
            <div className="workflow-condition-value">
              <span>Score</span>

              <strong>
                {data.conditionOperator ?? ">="}{" "}
                {data.conditionValue ?? 70}
              </strong>
            </div>

            {/* CONDITION BRANCHES */}

            <div className="workflow-condition-branches">
              <div className="workflow-condition-branch workflow-condition-yes">
                <span>YES</span>

                <Handle
                  type="source"
                  position={Position.Right}
                  id="yes"
                  className="workflow-handle workflow-output-handle workflow-yes-handle"
                />
              </div>

              <div className="workflow-condition-branch workflow-condition-no">
                <span>NO</span>

                <Handle
                  type="source"
                  position={Position.Right}
                  id="no"
                  className="workflow-handle workflow-output-handle workflow-no-handle"
                />
              </div>
            </div>
          </>
        )}

        {data.nodeType === "score" && (
          <div className="workflow-score-preview">
            Candidate evaluation
          </div>
        )}
      </div>

      {/* NORMAL OUTPUT */}

      {!isCondition && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="workflow-handle workflow-output-handle"
        />
      )}

      {/* EXECUTION STATUS */}

      {executionStatus === "running" && (
        <div className="workflow-node-execution">
          Running
        </div>
      )}

      {executionStatus === "completed" && (
        <div className="workflow-node-execution workflow-node-execution-completed">
          ✓ Completed
        </div>
      )}

      {executionStatus === "waiting" && (
        <div className="workflow-node-execution workflow-node-execution-waiting">
          Waiting
        </div>
      )}
    </div>
  );
};

export default WorkflowNode;