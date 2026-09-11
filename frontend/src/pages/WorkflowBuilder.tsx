import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import { useParams } from "react-router-dom";

import {
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

import WorkflowCanvas from "../components/workflow/WorkflowCanvas";
import NodePanel from "../components/workflow/NodePanel";
import NodeConfigPanel from "../components/workflow/NodeConfigPanel";

const initialNodes: Node[] = [
  {
    id: "trigger",
    type: "workflow",
    position: { x: 80, y: 250 },
    data: {
      label: "Trigger",
      description: "Start the recruitment workflow",
      nodeType: "trigger",
    },
  },
  {
    id: "resume-parser",
    type: "workflow",
    position: { x: 400, y: 250 },
    data: {
      label: "Resume Parser AI",
      description: "Extract candidate information",
      nodeType: "resume-parser",
    },
  },
  {
    id: "job-matching",
    type: "workflow",
    position: { x: 720, y: 250 },
    data: {
      label: "Job Matching",
      description: "Match candidate with job",
      nodeType: "job-matching",
    },
  },
  {
    id: "candidate-score",
    type: "workflow",
    position: { x: 1040, y: 250 },
    data: {
      label: "Candidate Score",
      description: "Calculate candidate score",
      nodeType: "score",
    },
  },
  {
    id: "condition",
    type: "workflow",
    position: { x: 1360, y: 250 },
    data: {
      label: "Condition",
      description: "Check candidate score",
      nodeType: "condition",
      conditionOperator: ">=",
      conditionValue: 70,
    },
  },
  {
    id: "shortlist",
    type: "workflow",
    position: { x: 1690, y: 130 },
    data: {
      label: "Shortlist",
      description: "Move qualified candidate forward",
      nodeType: "shortlist",
    },
  },
  {
    id: "reject",
    type: "workflow",
    position: { x: 1690, y: 370 },
    data: {
      label: "Reject",
      description: "Reject candidate from process",
      nodeType: "reject",
    },
  },
  {
    id: "shortlist-email",
    type: "workflow",
    position: { x: 2010, y: 130 },
    data: {
      label: "Send Email",
      description: "Send shortlist notification",
      nodeType: "email",
    },
  },
  {
    id: "reject-email",
    type: "workflow",
    position: { x: 2010, y: 370 },
    data: {
      label: "Send Email",
      description: "Send rejection notification",
      nodeType: "email",
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

const workflowData: Record<
  string,
  {
    nodes: Node[];
    edges: Edge[];
  }
> = {
  "resume-screening": {
    nodes: initialNodes,
    edges: [
      {
        id: "trigger-resume-parser",
        source: "trigger",
        target: "resume-parser",
      },
      {
        id: "resume-parser-job-matching",
        source: "resume-parser",
        target: "job-matching",
      },
      {
        id: "job-matching-score",
        source: "job-matching",
        target: "candidate-score",
      },
      {
        id: "score-condition",
        source: "candidate-score",
        target: "condition",
      },
      {
        id: "condition-shortlist",
        source: "condition",
        sourceHandle: "yes",
        target: "shortlist",
      },
      {
        id: "condition-reject",
        source: "condition",
        sourceHandle: "no",
        target: "reject",
      },
      {
        id: "shortlist-email",
        source: "shortlist",
        target: "shortlist-email",
      },
      {
        id: "reject-email",
        source: "reject",
        target: "reject-email",
      },
    ],
  },
};

type ExecutionStatus =
  | "running"
  | "completed"
  | "skipped";

type ExecutionLog = {
  nodeId: string;
  nodeLabel: string;
  status: ExecutionStatus;
};

type WorkflowDraft = {
  workflowName: string;
  nodes: Node[];
  edges: Edge[];
  testCandidateScore: number;
};

const WorkflowBuilder = () => {
  const { id } = useParams<{ id: string }>();

  const currentWorkflow = id
    ? workflowData[id]
    : undefined;

  const [nodes, setNodes, onNodesChange] =
    useNodesState(
      currentWorkflow?.nodes ?? initialNodes
    );

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(
      currentWorkflow?.edges ?? initialEdges
    );

  const [selectedNode, setSelectedNode] =
    useState<Node | null>(null);

  const [workflowName, setWorkflowName] =
    useState(
      id === "resume-screening"
        ? "Resume Screening"
        : id === "candidate-email"
          ? "Candidate Email"
          : id === "interview-scheduling"
            ? "Interview Scheduling"
            : "Untitled Workflow"
    );

  const [showNodePanel, setShowNodePanel] =
    useState(true);

  const [showConfigPanel, setShowConfigPanel] =
    useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [nodeToDelete, setNodeToDelete] =
    useState<Node | null>(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [testCandidateScore, setTestCandidateScore] =
    useState(82);

  const [executionLog, setExecutionLog] =
    useState<ExecutionLog[]>([]);

  const [executionCompleted, setExecutionCompleted] =
    useState(false);

  const requestDeleteNode = useCallback(
    (node: Node) => {
      setNodeToDelete(node);
      setShowDeleteModal(true);
    },
    []
  );

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
  }, [requestDeleteNode, setNodes]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (
        !connection.source ||
        !connection.target
      ) {
        return;
      }

      setEdges((currentEdges) => {
        const connectionAlreadyExists =
          currentEdges.some(
            (edge) =>
              edge.source ===
                connection.source &&
              edge.target ===
                connection.target &&
              edge.sourceHandle ===
                connection.sourceHandle &&
              edge.targetHandle ===
                connection.targetHandle
          );

        if (connectionAlreadyExists) {
          return currentEdges;
        }

        const sourceNode = nodes.find(
          (node) =>
            node.id === connection.source
        );

        if (!sourceNode) {
          return currentEdges;
        }

        const isCondition =
          sourceNode.data.nodeType ===
          "condition";

        if (
          isCondition &&
          connection.sourceHandle !==
            "yes" &&
          connection.sourceHandle !== "no"
        ) {
          return currentEdges;
        }

        if (isCondition) {
          const branchAlreadyConnected =
            currentEdges.some(
              (edge) =>
                edge.source ===
                  connection.source &&
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
    _event: MouseEvent,
    node: Node
  ) => {
    const latestNode = nodes.find(
      (currentNode) =>
        currentNode.id === node.id
    );

    setSelectedNode(
      latestNode ?? node
    );
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
      currentNode &&
      currentNode.id === nodeId
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
      (node) =>
        node.data.nodeType === "trigger"
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
      (node) =>
        !connectedNodeIds.has(node.id)
    );

    if (disconnectedNode) {
      return `Node "${disconnectedNode.data.label}" is not connected.`;
    }

    const triggerNode = nodes.find(
      (node) =>
        node.data.nodeType === "trigger"
    );

    if (!triggerNode) {
      return "Workflow must contain a Trigger node.";
    }

    const triggerHasOutput = edges.some(
      (edge) =>
        edge.source === triggerNode.id
    );

    if (!triggerHasOutput) {
      return "Trigger must be connected to the next workflow node.";
    }

    return null;
  };

  const handlePublish = () => {
    const validationError =
      validateWorkflow();

    if (validationError) {
      window.alert(validationError);
      return;
    }

    window.alert(
      "Workflow is ready to publish."
    );
  };

  const handleRunWorkflow = () => {
    const validationError =
      validateWorkflow();

    if (validationError) {
      window.alert(validationError);
      return;
    }

    setIsRunning(true);
    setExecutionCompleted(false);
    setExecutionLog([]);

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
    const skippedNodeIds = new Set<string>();

    let currentNodeId =
      nodes.find(
        (node) =>
          node.data.nodeType ===
          "trigger"
      )?.id ?? null;

    while (currentNodeId) {
      executionOrder.push(
        currentNodeId
      );

      const currentNode = nodes.find(
        (node) =>
          node.id === currentNodeId
      );

      if (!currentNode) {
        break;
      }

      const outgoingEdges = edges.filter(
        (edge) =>
          edge.source ===
          currentNodeId
      );

      let nextEdge:
        | Edge
        | undefined;

      if (
        currentNode.data.nodeType ===
        "condition"
      ) {
        const candidateScore =
          testCandidateScore;

        const conditionValue =
          Number(
            currentNode.data
              .conditionValue ?? 70
          );

        const operator =
          currentNode.data
            .conditionOperator ?? ">=";

        let conditionResult =
          false;

        switch (operator) {
          case ">=":
            conditionResult =
              candidateScore >=
              conditionValue;
            break;

          case ">":
            conditionResult =
              candidateScore >
              conditionValue;
            break;

          case "=":
            conditionResult =
              candidateScore ===
              conditionValue;
            break;

          case "<":
            conditionResult =
              candidateScore <
              conditionValue;
            break;

          case "<=":
            conditionResult =
              candidateScore <=
              conditionValue;
            break;
        }

        const selectedHandle =
          conditionResult
            ? "yes"
            : "no";

        const skippedHandle =
          conditionResult
            ? "no"
            : "yes";

        const selectedEdge =
          outgoingEdges.find(
            (edge) =>
              edge.sourceHandle ===
              selectedHandle
          );

        const skippedEdge =
          outgoingEdges.find(
            (edge) =>
              edge.sourceHandle ===
              skippedHandle
          );

        const collectSkippedBranch = (
          startNodeId: string
        ) => {
          const queue = [
            startNodeId,
          ];

          const visited =
            new Set<string>();

          while (
            queue.length > 0
          ) {
            const nodeId =
              queue.shift();

            if (
              !nodeId ||
              visited.has(nodeId)
            ) {
              continue;
            }

            visited.add(nodeId);

            if (
              nodeId !==
              currentNodeId
            ) {
              skippedNodeIds.add(
                nodeId
              );
            }

            const nextEdges =
              edges.filter(
                (edge) =>
                  edge.source ===
                  nodeId
              );

            nextEdges.forEach(
              (edge) => {
                if (
                  !executionOrder.includes(
                    edge.target
                  )
                ) {
                  queue.push(
                    edge.target
                  );
                }
              }
            );
          }
        };

        if (skippedEdge) {
          collectSkippedBranch(
            skippedEdge.target
          );
        }

        nextEdge = selectedEdge;
      } else {
        nextEdge =
          outgoingEdges[0];
      }

      currentNodeId =
        nextEdge?.target ?? null;
    }

    const executionNodes =
      executionOrder
        .map((nodeId) =>
          nodes.find(
            (node) =>
              node.id === nodeId
          )
        )
        .filter(
          (node): node is Node =>
            node !== undefined
        );

    const skippedNodes =
      nodes.filter(
        (node) =>
          skippedNodeIds.has(
            node.id
          ) &&
          !executionOrder.includes(
            node.id
          )
      );

    const logEntries: ExecutionLog[] =
      [
        ...executionNodes.map(
          (node) => ({
            nodeId: node.id,
            nodeLabel:
              node.data.label,
            status:
              "running" as const,
          })
        ),

        ...skippedNodes.map(
          (node) => ({
            nodeId: node.id,
            nodeLabel:
              node.data.label,
            status:
              "skipped" as const,
          })
        ),
      ];

    setExecutionLog(
      logEntries
    );

    executionOrder.forEach(
      (nodeId, index) => {
        const startTime =
          index * 1200;

        window.setTimeout(
          () => {
            setNodes(
              (currentNodes) =>
                currentNodes.map(
                  (node) =>
                    node.id ===
                    nodeId
                      ? {
                          ...node,
                          data: {
                            ...node.data,
                            executionStatus:
                              "running",
                          },
                        }
                      : node
                )
            );

            setExecutionLog(
              (currentLog) =>
                currentLog.map(
                  (log) =>
                    log.nodeId ===
                    nodeId
                      ? {
                          ...log,
                          status:
                            "running",
                        }
                      : log
                )
            );
          },
          startTime
        );

        window.setTimeout(
          () => {
            setNodes(
              (currentNodes) =>
                currentNodes.map(
                  (node) =>
                    node.id ===
                    nodeId
                      ? {
                          ...node,
                          data: {
                            ...node.data,
                            executionStatus:
                              "completed",
                          },
                        }
                      : node
                )
            );

            setExecutionLog(
              (currentLog) =>
                currentLog.map(
                  (log) =>
                    log.nodeId ===
                    nodeId
                      ? {
                          ...log,
                          status:
                            "completed",
                        }
                      : log
                )
            );
          },
          startTime + 800
        );
      }
    );

    window.setTimeout(
      () => {
        setIsRunning(false);
        setExecutionCompleted(
          true
        );
      },
      executionOrder.length *
        1200
    );
  };

  const handleSaveDraft = () => {
    const draft: WorkflowDraft =
      {
        workflowName,
        nodes,
        edges,
        testCandidateScore,
      };

    localStorage.setItem(
      `agentflow-workflow-draft-${id ?? "new"}`,
      JSON.stringify(draft)
    );

    window.alert(
      "Draft saved successfully."
    );
  };

  useEffect(() => {
    const savedDraft =
      localStorage.getItem(
        `agentflow-workflow-draft-${id ?? "new"}`
      );

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft =
        JSON.parse(
          savedDraft
        ) as WorkflowDraft;

      if (
        Array.isArray(
          parsedDraft.nodes
        )
      ) {
        setNodes(
          parsedDraft.nodes.map(
            (node: Node) => ({
              ...node,
              data: {
                ...node.data,
                onDelete: () =>
                  requestDeleteNode(
                    node
                  ),
              },
            })
          )
        );
      }

      if (
        Array.isArray(
          parsedDraft.edges
        )
      ) {
        setEdges(
          parsedDraft.edges
        );
      }

      if (
        typeof parsedDraft.workflowName ===
          "string" &&
        parsedDraft.workflowName.trim()
      ) {
        setWorkflowName(
          parsedDraft.workflowName
        );
      }

      if (
        typeof parsedDraft.testCandidateScore ===
          "number" &&
        parsedDraft.testCandidateScore >=
          0 &&
        parsedDraft.testCandidateScore <=
          100
      ) {
        setTestCandidateScore(
          parsedDraft.testCandidateScore
        );
      }
    } catch (error) {
      console.error(
        "Failed to load workflow draft:",
        error
      );
    }
  }, [
    id,
    requestDeleteNode,
    setNodes,
    setEdges,
  ]);

  return (
    <div>
      {/* HEADER */}

      <div className="workflow-builder-header">
        <div className="workflow-header-left">
          <div className="workflow-breadcrumb">
            <span>Workflows</span>
            <span>/</span>
            <span className="text-dark">
              Builder
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="workflow-title-input"
              value={workflowName}
              onChange={(event) =>
                setWorkflowName(
                  event.target.value
                )
              }
            />

            <span className="workflow-status">
              <span className="workflow-status-dot" />
              Draft
            </span>
          </div>

          <p className="workflow-subtitle">
            Design, configure and
            automate your recruitment
            process.
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
            onClick={
              handleRunWorkflow
            }
            disabled={isRunning}
          >
            {isRunning
              ? "Running..."
              : "▶ Run Workflow"}
          </button>

          <button
            type="button"
            className="workflow-publish-btn"
            onClick={
              handlePublish
            }
          >
            Publish Workflow
            <span>→</span>
          </button>
        </div>
      </div>

      {/* TEST TOOLBAR */}

      <div className="workflow-test-toolbar">
        <div className="workflow-test-score">
          <div>
            <label className="fw-semibold mb-0">
              Test Candidate Score
            </label>

            <div className="small text-secondary">
              Test the condition branch.
            </div>
          </div>

          <input
            type="number"
            min="0"
            max="100"
            className="form-control workflow-score-input"
            value={
              testCandidateScore
            }
            onChange={(event) =>
              setTestCandidateScore(
                Number(
                  event.target.value
                )
              )
            }
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
              setShowNodePanel(
                (current) =>
                  !current
              )
            }
          >
            ☰ Nodes
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
              setShowConfigPanel(
                (current) =>
                  !current
              )
            }
          >
            ⚙ Configuration
          </button>
        </div>
      </div>

      {/* BUILDER */}

      <div className="row g-3">
        {showNodePanel && (
          <div className="col-12 col-xl-3">
            <NodePanel
              onAddNode={
                handleAddNode
              }
            />
          </div>
        )}

        <div
          className={
            showNodePanel &&
            showConfigPanel
              ? "col-12 col-xl-6"
              : showNodePanel ||
                  showConfigPanel
                ? "col-12 col-xl-9"
                : "col-12"
          }
        >
          <div className="card border-0 shadow-sm overflow-hidden">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={
                onNodesChange
              }
              onEdgesChange={
                onEdgesChange
              }
              onConnect={
                handleConnect
              }
              onNodeClick={
                handleNodeClick
              }
            />

            {/* EXECUTION LOG */}

            <div className="execution-log-panel">
              <div className="execution-log-header">
                <div>
                  <h5>
                    Execution Log
                  </h5>

                  <p className="text-secondary small mb-0">
                    Workflow execution
                    history
                  </p>
                </div>

                <div className="execution-node-count">
                  {
                    executionLog.length
                  }{" "}
                  nodes
                </div>
              </div>

              {executionCompleted && (
                <div className="execution-summary">
                  <div className="execution-summary-icon">
                    ✓
                  </div>

                  <div className="flex-grow-1">
                    <div className="execution-summary-title">
                      Workflow execution
                      completed
                    </div>

                    <div className="execution-summary-meta">
                      <span>
                        {
                          executionLog.filter(
                            (log) =>
                              log.status ===
                              "completed"
                          ).length
                        }{" "}
                        completed
                      </span>

                      <span className="execution-summary-dot">
                        •
                      </span>

                      <span>
                        {
                          executionLog.filter(
                            (log) =>
                              log.status ===
                              "skipped"
                          ).length
                        }{" "}
                        skipped
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {executionLog.length ===
              0 ? (
                <div className="execution-log-empty">
                  Run the workflow to
                  see execution steps
                  here.
                </div>
              ) : (
                <div className="execution-log-list">
                  {executionLog.map(
                    (log) => (
                      <div
                        key={
                          log.nodeId
                        }
                        className={`execution-log-item execution-${log.status}`}
                      >
                        <div className="execution-status-icon">
                          {log.status ===
                            "completed" &&
                            "✓"}

                          {log.status ===
                            "running" &&
                            "⋯"}

                          {log.status ===
                            "skipped" &&
                            "–"}
                        </div>

                        <div className="execution-log-content">
                          <div className="execution-log-node-name">
                            {
                              log.nodeLabel
                            }
                          </div>

                          <div className="execution-log-status">
                            {log.status ===
                              "completed" &&
                              "Completed"}

                            {log.status ===
                              "running" &&
                              "Running"}

                            {log.status ===
                              "skipped" &&
                              "Skipped"}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showConfigPanel && (
          <div className="col-12 col-xl-3">
            <NodeConfigPanel
              key={
                selectedNode?.id ??
                "no-node"
              }
              node={
                selectedNode
              }
              onUpdateNode={
                handleUpdateNode
              }
            />
          </div>
        )}
      </div>

      {/* DELETE MODAL */}

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
              {
                nodeToDelete?.data
                  .label
              }
            </strong>

            <p className="text-muted mt-3">
              This action cannot
              be undone.
            </p>

            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-light flex-fill"
                onClick={
                  cancelDelete
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-danger flex-fill"
                onClick={
                  confirmDeleteNode
                }
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