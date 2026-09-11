import { useCallback, useEffect, useState } from "react";
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
      nodeType: "trigger",
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
      nodeType: "resume-parser",
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

  const [workflowName, setWorkflowName] =
    useState("Untitled Workflow");

  const [showNodePanel, setShowNodePanel] =
    useState(true);

  const [showConfigPanel, setShowConfigPanel] =
    useState(true);


  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [nodeToDelete, setNodeToDelete] =
    useState<Node | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      setEdges((currentEdges) => {
        const connectionAlreadyExists =
          currentEdges.some(
            (edge) =>
              edge.source === connection.source &&
              edge.target === connection.target &&
              edge.sourceHandle ===
              connection.sourceHandle &&
              edge.targetHandle ===
              connection.targetHandle
          );

        if (connectionAlreadyExists) {
          return currentEdges;
        }

        const sourceNode = nodes.find(
          (node) => node.id === connection.source
        );

        if (!sourceNode) {
          return currentEdges;
        }

        const isCondition =
          sourceNode.data.nodeType === "condition";

        if (
          isCondition &&
          connection.sourceHandle !== "yes" &&
          connection.sourceHandle !== "no"
        ) {
          return currentEdges;
        }

        if (isCondition) {
          const branchAlreadyConnected =
            currentEdges.some(
              (edge) =>
                edge.source === connection.source &&
                edge.sourceHandle ===
                connection.sourceHandle
            );

          if (branchAlreadyConnected) {
            return currentEdges;
          }
        }

        return addEdge(
          {
            ...connection,
            type: "default",
          },
          currentEdges
        );
      });
    },
    [nodes, setEdges]
  );

  const requestDeleteNode = (
    node: Node
  ) => {
    setNodeToDelete(node);
    setShowDeleteModal(true);
  };


  const confirmDeleteNode = () => {
    if (!nodeToDelete) {
      return;
    }

    handleDeleteNode(nodeToDelete.id);

    setNodeToDelete(null);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setNodeToDelete(null);
    setShowDeleteModal(false);
  };


  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes) =>
        currentNodes.filter(
          (node) => node.id !== nodeId
        )
      );

      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) =>
            edge.source !== nodeId &&
            edge.target !== nodeId
        )
      );

      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: () =>
            requestDeleteNode(node),
        },
      }))
    );
  }, [handleDeleteNode, setNodes]);

  const handleAddNode = (
    type: string,
    label: string,
    description: string
  ) => {
    const nodeId = `${type}-${Date.now()}`;

    const newNode: Node = {
      id: nodeId,
      type: "workflow",
      position: {
        x: 250,
        y: 100 + nodes.length * 150,
      },
      data: {
        label,
        description,
        nodeType: type,
        onDelete: () =>
          requestDeleteNode(newNode),
      },
    };

    setNodes((currentNodes) => [
      ...currentNodes,
      newNode,
    ]);
  };

  const handleNodeClick = (
    _event: React.MouseEvent,
    node: Node
  ) => {
    const latestNode = nodes.find(
      (currentNode) => currentNode.id === node.id
    );

    setSelectedNode(latestNode ?? node);
  };

  const handleUpdateNode = (
    nodeId: string,
    data: Record<string, unknown>
  ) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          }
          : node
      )
    );

    setSelectedNode((currentNode) =>
      currentNode && currentNode.id === nodeId
        ? {
          ...currentNode,
          data: {
            ...currentNode.data,
            ...data,
          },
        }
        : currentNode
    );
  };


  const validateWorkflow = () => {
    if (nodes.length === 0) {
      return "Workflow must contain at least one node.";
    }

    const hasTrigger = nodes.some(
      (node) => node.data.nodeType === "trigger"
    );

    if (!hasTrigger) {
      return "Workflow must contain a Trigger node.";
    }

    if (nodes.length < 2) {
      return "Workflow must contain at least two nodes.";
    }

    if (edges.length === 0) {
      return "Workflow must contain at least one connection.";
    }

    const nodeIds = new Set(
      nodes.map((node) => node.id)
    );

    const invalidEdge = edges.find(
      (edge) =>
        !nodeIds.has(edge.source) ||
        !nodeIds.has(edge.target)
    );

    if (invalidEdge) {
      return "Workflow contains an invalid connection.";
    }

    const connectedNodeIds = new Set<string>();

    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const disconnectedNode = nodes.find(
      (node) => !connectedNodeIds.has(node.id)
    );

    if (disconnectedNode) {
      return `Node "${disconnectedNode.data.label}" is not connected.`;
    }

    const triggerNode = nodes.find(
      (node) => node.data.nodeType === "trigger"
    );

    if (!triggerNode) {
      return "Workflow must contain a Trigger node.";
    }

    const triggerHasOutput = edges.some(
      (edge) => edge.source === triggerNode.id
    );

    if (!triggerHasOutput) {
      return "Trigger must be connected to the next workflow node.";
    }

    return null;
  };


  const handlePublish = () => {
    const validationError = validateWorkflow();

    if (validationError) {
      window.alert(validationError);
      return;
    }

    window.alert("Workflow is ready to publish.");
  };


const handleRunWorkflow = () => {
  const validationError = validateWorkflow();

  if (validationError) {
    window.alert(validationError);
    return;
  }

  setIsRunning(true);

  setNodes((currentNodes) =>
    currentNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        executionStatus: "waiting",
      },
    }))
  );

  const executionOrder: string[] = [];

  let currentNodeId =
    nodes.find(
      (node) => node.data.nodeType === "trigger"
    )?.id ?? null;

  while (currentNodeId) {
    executionOrder.push(currentNodeId);

    const currentNode = nodes.find(
      (node) => node.id === currentNodeId
    );

    if (!currentNode) {
      break;
    }

    const outgoingEdges = edges.filter(
      (edge) => edge.source === currentNodeId
    );

    let nextEdge: Edge | undefined;

    if (
      currentNode.data.nodeType === "condition"
    ) {
      const candidateScore = 82;

      const conditionValue = Number(
        currentNode.data.conditionValue ?? 70
      );

      const operator =
        currentNode.data.conditionOperator ?? ">=";

      let conditionResult = false;

      switch (operator) {
        case ">=":
          conditionResult =
            candidateScore >= conditionValue;
          break;

        case ">":
          conditionResult =
            candidateScore > conditionValue;
          break;

        case "=":
          conditionResult =
            candidateScore === conditionValue;
          break;

        case "<":
          conditionResult =
            candidateScore < conditionValue;
          break;

        case "<=":
          conditionResult =
            candidateScore <= conditionValue;
          break;
      }

      const branchHandle = conditionResult
        ? "yes"
        : "no";

      nextEdge = outgoingEdges.find(
        (edge) =>
          edge.sourceHandle === branchHandle
      );
    } else {
      nextEdge = outgoingEdges[0];
    }

    currentNodeId =
      nextEdge?.target ?? null;
  }

  executionOrder.forEach((nodeId, index) => {
    window.setTimeout(() => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  executionStatus: "running",
                },
              }
            : node
        )
      );
    }, index * 1200);

    window.setTimeout(() => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  executionStatus: "completed",
                },
              }
            : node
        )
      );
    }, index * 1200 + 800);
  });

  window.setTimeout(
    () => {
      setIsRunning(false);
    },
    executionOrder.length * 1200
  );
};

  const handleSaveDraft = () => {
    const workflow = {
      workflowName,
      nodes,
      edges,
    };

    localStorage.setItem(
      "agentflow-workflow-draft",
      JSON.stringify(workflow)
    );

    window.alert("Workflow draft saved.");
  };



  useEffect(() => {
    const savedDraft = localStorage.getItem(
      "agentflow-workflow-draft"
    );

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft);

      if (
        !Array.isArray(parsedDraft.nodes) ||
        !Array.isArray(parsedDraft.edges)
      ) {
        return;
      }

      setNodes(
        parsedDraft.nodes.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: () =>
              requestDeleteNode(node),
          },
        }))
      );

      setEdges(parsedDraft.edges);
    } catch (error) {
      console.error(
        "Failed to load workflow draft:",
        error
      );
    }
  }, [handleDeleteNode, setNodes, setEdges]);



  return (
    <div>
      <div className="workflow-builder-header">
        <div className="workflow-header-left">
          <div className="workflow-breadcrumb">
            <span>Workflows</span>
            <span>/</span>
            <span className="text-dark">Builder</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="workflow-title-input"
              value={workflowName}
              onChange={(event) =>
                setWorkflowName(event.target.value)
              }
            />

            <span className="workflow-status">
              <span className="workflow-status-dot" />
              Draft
            </span>
          </div>

          <p className="workflow-subtitle">
            Design, configure and automate your recruitment process.
          </p>
        </div>

        <div className="workflow-header-actions">
          <button
            type="button"
            className="workflow-action-btn"
            onClick={handleSaveDraft}
          >
            <span>↓</span>
            Save
          </button>


          <button
            type="button"
            className="workflow-run-btn"
            onClick={handleRunWorkflow}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "▶ Run Workflow"}
          </button>


          <button
            type="button"
            className="workflow-publish-btn"
            onClick={handlePublish}
          >
            Publish Workflow
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
              setShowNodePanel((current) => !current)
            }
          >
            ☰ Nodes
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
              setShowConfigPanel((current) => !current)
            }
          >
            ⚙ Configuration
          </button>
        </div>
      </div>

      <div className="row g-3">
        {showNodePanel && (
          <div className="col-12 col-xl-3">
            <NodePanel
              onAddNode={handleAddNode}
            />
          </div>
        )}

        <div
          className={
            showNodePanel && showConfigPanel
              ? "col-12 col-xl-6"
              : showNodePanel || showConfigPanel
                ? "col-12 col-xl-9"
                : "col-12"
          }
        >
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

        {showConfigPanel && (
          <div className="col-12 col-xl-3">
            <NodeConfigPanel
              key={selectedNode?.id ?? "no-node"}
              node={selectedNode}
              onUpdateNode={handleUpdateNode}
            />
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              ⚠
            </div>

            <h4>
              Delete Node?
            </h4>

            <p>
              You are deleting:
            </p>

            <strong>
              {nodeToDelete?.data.label}
            </strong>

            <p className="text-muted mt-3">
              This action cannot be undone.
            </p>

            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-light flex-fill"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger flex-fill"
                onClick={confirmDeleteNode}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;