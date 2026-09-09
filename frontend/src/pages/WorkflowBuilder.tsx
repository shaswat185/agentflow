import { useCallback, useState } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";

import WorkflowCanvas from "../components/workflow/WorkflowCanvas";
import NodePanel from "../components/workflow/NodePanel";
import NodeConfigPanel from "../components/workflow/NodeConfigPanel";

const initialNodes: Node[] = [
  {
    id: "trigger",
    type: "workflow",
    position: {
      x: 80,
      y: 180,
    },
    data: {
      label: "Trigger",
      description: "Start a workflow",
    },
  },
  {
    id: "resume-parser",
    type: "workflow",
    position: {
      x: 400,
      y: 180,
    },
    data: {
      label: "Resume Parser AI",
      description: "Extract candidate information",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "trigger-resume-parser",
    source: "trigger",
    target: "resume-parser",
  },
];

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] =
    useState<Node | null>(null);

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(connection, currentEdges)
      );
    },
    [setEdges]
  );

  const handleAddNode = (nodeType: string) => {
    const descriptions: Record<string, string> = {
      Trigger: "Start a workflow",
      "Resume Parser": "Extract candidate information",
      "AI Matching": "Match candidate with a job",
      "Score Candidate": "Calculate candidate score",
      Condition: "Check a condition",
      Email: "Send an email",
    };

    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: "workflow",
      position: {
        x: 100 + (nodes.length % 3) * 300,
        y: 100 + Math.floor(nodes.length / 3) * 180,
      },
      data: {
        label: nodeType,
        description:
          descriptions[nodeType] || "Workflow node",
      },
    };

    setNodes((currentNodes) => [
      ...currentNodes,
      newNode,
    ]);
  };

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Workflow Builder
          </h2>

          <p className="text-muted mb-0">
            Build your AI recruitment automation workflow.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
          >
            Save Draft
          </button>

          <button
            type="button"
            className="btn btn-primary"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-3">
          <NodePanel
            onAddNode={handleAddNode}
          />
        </div>

        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm overflow-hidden">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onNodeClick={handleNodeClick}
            />
          </div>
        </div>

        <div className="col-12 col-xl-3">
          <NodeConfigPanel
            node={selectedNode}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;