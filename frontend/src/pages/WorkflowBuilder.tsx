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

import {
  createWorkflow,
  updateWorkflow,
  getWorkflowById,
} from "../services/workflowService";

import {
  runWorkflow,
  type ExecutionStep,
} from "../services/workflowExecutionService";

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
      nodeType: "candidate-score",
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
      operator: ">=",
      value: 70,
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
      nodeType: "shortlist-email",
    },
  },
  {
    id: "reject-email",
    type: "workflow",
    position: { x: 2010, y: 370 },
    data: {
      label: "Send Email",
      description: "Send rejection notification",
      nodeType: "reject-email",
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

  const [executionSteps, setExecutionSteps] =
    useState<ExecutionStep[]>([]);

  const [executionScore, setExecutionScore] =
    useState<number | null>(null);

  const [executionStatus, setExecutionStatus] =
    useState<
      "shortlisted" | "rejected" | null
    >(null);

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

  /*
   * Load workflow from MongoDB when a real MongoDB
   * workflow ID is opened.
   */
  useEffect(() => {
    const isMongoWorkflowId =
      Boolean(id) &&
      /^[0-9a-fA-F]{24}$/.test(id);

    if (!isMongoWorkflowId || !id) {
      return;
    }

    const loadWorkflow = async () => {
      try {
        const response =
          await getWorkflowById(id);

        const workflow =
          (response as any)?.data ??
          response;

        if (!workflow) {
          return;
        }

        if (Array.isArray(workflow.nodes)) {
          setNodes(
            workflow.nodes.map(
              (node: Node) => ({
                ...node,
                data: {
                  ...node.data,
                  onDelete: () =>
                    requestDeleteNode(node),
                },
              })
            )
          );
        }

        if (Array.isArray(workflow.edges)) {
          setEdges(workflow.edges);
        }

        if (
          typeof workflow.name ===
          "string" &&
          workflow.name.trim()
        ) {
          setWorkflowName(
            workflow.name
          );
        }
      } catch (error) {
        console.error(
          "Failed to load workflow from MongoDB:",
          error
        );
      }
    };

    void loadWorkflow();
  }, [
    id,
    requestDeleteNode,
    setNodes,
    setEdges,
  ]);

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
    let backendNodeType = type;

    if (type === "score") {
      backendNodeType =
        "candidate-score";
    }

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
        nodeType: backendNodeType,
        ...(backendNodeType ===
        "condition"
          ? {
              conditionOperator: ">=",
              conditionValue: 70,
              operator: ">=",
              value: 70,
            }
          : {}),
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
    const normalizedData = {
      ...data,
    };

    /*
     * Keep frontend condition fields and backend
     * condition fields synchronized.
     */
    if (
      "conditionOperator" in data
    ) {
      normalizedData.operator =
        data.conditionOperator;
    }

    if (
      "conditionValue" in data
    ) {
      normalizedData.value =
        data.conditionValue;
    }

    if ("operator" in data) {
      normalizedData.conditionOperator =
        data.operator;
    }

    if ("value" in data) {
      normalizedData.conditionValue =
        data.value;
    }

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...normalizedData,
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
              ...normalizedData,
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

    const connectedNodeIds =
      new Set<string>();

    edges.forEach((edge) => {
      connectedNodeIds.add(
        edge.source
      );
      connectedNodeIds.add(
        edge.target
      );
    });

    const disconnectedNode =
      nodes.find(
        (node) =>
          !connectedNodeIds.has(
            node.id
          )
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

    const triggerHasOutput =
      edges.some(
        (edge) =>
          edge.source ===
          triggerNode.id
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

  const handleSaveDraft = async () => {
    try {
      const workflowPayload = {
        name: workflowName.trim() || "Untitled Workflow",
        description: "AI recruitment workflow",
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            ...node.data,
            onDelete: undefined,
          },
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        })),
        status: "draft" as const,
      };

      const mongoWorkflowId =
        id && /^[0-9a-fA-F]{24}$/.test(id)
          ? id
          : localStorage.getItem(
              "agentflow-current-workflow-id"
            );

      const savedWorkflow = mongoWorkflowId
        ? await updateWorkflow(
            mongoWorkflowId,
            workflowPayload
          )
        : await createWorkflow(
            workflowPayload
          );

      const workflow =
        (savedWorkflow as any)?.data ??
        savedWorkflow;

      if (!workflow?._id) {
        throw new Error(
          "Workflow saved but no workflow ID was returned."
        );
      }

      localStorage.setItem(
        "agentflow-current-workflow-id",
        workflow._id
      );

      localStorage.setItem(
        `agentflow-workflow-draft-${id ?? "new"}`,
        JSON.stringify({
          workflowName,
          nodes,
          edges,
          testCandidateScore,
        } satisfies WorkflowDraft)
      );

      if (
        !id ||
        !/^[0-9a-fA-F]{24}$/.test(id)
      ) {
        window.history.replaceState(
          {},
          "",
          `/workflows/${workflow._id}`
        );
      }

      window.alert(
        "Workflow saved successfully."
      );
    } catch (error) {
      console.error(
        "Save workflow error:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to save workflow"
      );
    }
  };

  /*
   * Find frontend node label from backend node ID.
   */
  const getNodeLabel = (
    nodeId: string,
    fallback: string
  ) => {
    const node = nodes.find(
      (currentNode) =>
        currentNode.id === nodeId
    );

    return (
      node?.data?.label ||
      fallback
    );
  };

  const handleRunWorkflow = async () => {
  const validationError = validateWorkflow();

  if (validationError) {
    window.alert(validationError);
    return;
  }

  try {
    setIsRunning(true);
    setExecutionCompleted(false);
    setExecutionLog([]);
    setExecutionSteps([]);
    setExecutionScore(null);
    setExecutionStatus(null);

    /*
     * Get saved MongoDB workflow ID.
     */
    let mongoWorkflowId =
      id && /^[0-9a-fA-F]{24}$/.test(id)
        ? id
        : localStorage.getItem(
            "agentflow-current-workflow-id"
          );

    /*
     * If workflow has not been saved yet,
     * automatically save it before execution.
     */
    if (!mongoWorkflowId) {
      const workflowPayload = {
        name: workflowName.trim() || "Untitled Workflow",
        description:
          "Automatically screen candidate resumes",
        nodes: nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: undefined,
          },
        })),
        edges,
        status: "draft" as const,
      };

      const response = await createWorkflow(
        workflowPayload
      );

      const savedWorkflow =
        (response as any)?.data ??
        response;

      if (!savedWorkflow?._id) {
        throw new Error(
          "Workflow was saved but workflow ID was not returned."
        );
      }

      mongoWorkflowId = savedWorkflow._id;

      localStorage.setItem(
        "agentflow-current-workflow-id",
        mongoWorkflowId
      );
    }

    /*
     * Existing test candidate.
     */
    const candidateId =
      "6aa7cdf781f2b8169b0de03d";

    /*
     * Existing Full Stack Developer job.
     */
    const jobId =
      "6aac4ea42aa30b677bf286be";

    /*
     * Test resume used for automatic workflow execution.
     */
    const resumeText = `
Rahul Sharma is a Full Stack Developer with 2 years of
experience building web applications.

Technical Skills:
React.js, JavaScript, TypeScript, Node.js, Express.js,
MongoDB, REST APIs, HTML, CSS and Git.

Experience:
Developed responsive React applications, REST APIs,
authentication systems and database-driven applications.
Experienced in working with Node.js, Express.js and MongoDB.

Education:
Bachelor's degree in Computer Science.

The candidate has strong experience in frontend and backend
development and has worked on full-stack web applications.
    `.trim();

    /*
     * Reset node execution state.
     */
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          executionStatus: "waiting",
        },
      }))
    );

    /*
     * REAL BACKEND EXECUTION
     */
    const result = await runWorkflow({
      workflowId: mongoWorkflowId,
      candidateId,
      jobId,
      resumeText,
    });

    const steps = result.steps || [];

    /*
     * Store execution result.
     */
    setExecutionSteps(steps);

    setExecutionScore(
      result.matchScore ?? null
    );

    setExecutionStatus(
      result.finalStatus
    );

    /*
     * Convert backend execution
     * into frontend execution log.
     */
    const backendLogs: ExecutionLog[] =
      steps.map((step) => ({
        nodeId: step.nodeId,
        nodeLabel: getNodeLabel(
          step.nodeId,
          step.nodeType
        ),
        status:
          step.status === "completed"
            ? "completed"
            : "skipped",
      }));

    setExecutionLog(backendLogs);

    /*
     * Update workflow nodes visually.
     */
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const step = steps.find(
          (item) =>
            item.nodeId === node.id
        );

        if (!step) {
          return {
            ...node,
            data: {
              ...node.data,
              executionStatus: "skipped",
            },
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            executionStatus:
              step.status,
          },
        };
      })
    );

    setExecutionCompleted(true);

    /*
     * Show final result.
     */
    window.alert(
      `Workflow completed successfully.\n\n` +
      `Candidate Status: ${result.finalStatus}\n` +
      `AI Match Score: ${result.matchScore}%`
    );
  } catch (error) {
    console.error(
      "Workflow execution error:",
      error
    );

    setExecutionCompleted(false);

    window.alert(
      error instanceof Error
        ? error.message
        : "Workflow execution failed"
    );
  } finally {
    setIsRunning(false);
  }
};

  /*
   * Restore local draft.
   */
  useEffect(() => {
    const savedDraft =
      localStorage.getItem(
        `agentflow-workflow-draft-${
          id ?? "new"
        }`
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
            <span>
              Workflows
            </span>

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
            onClick={
              handleSaveDraft
            }
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

      {/* REAL EXECUTION SUMMARY */}

      {executionCompleted && (
        <div className="container-fluid mt-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <div className="small text-secondary">
                    AI Match Score
                  </div>

                  <h3 className="mb-0">
                    {executionScore ?? 0}%
                  </h3>
                </div>

                <div>
                  <div className="small text-secondary">
                    Final Status
                  </div>

                  <span
                    className={`badge ${
                      executionStatus ===
                      "shortlisted"
                        ? "text-bg-success"
                        : "text-bg-danger"
                    }`}
                  >
                    {
                      executionStatus
                    }
                  </span>
                </div>

                <div>
                  <div className="small text-secondary">
                    Executed Steps
                  </div>

                  <h5 className="mb-0">
                    {
                      executionSteps.length
                    }
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUILDER */}

      <div className="row g-3 mt-1">
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
                    Real workflow execution
                    details
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

                  {executionScore !==
                    null && (
                    <div className="text-end">
                      <div className="small text-secondary">
                        AI Score
                      </div>

                      <strong>
                        {
                          executionScore
                        }
                        %
                      </strong>
                    </div>
                  )}
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
                    (log, index) => (
                      <div
                        key={`${log.nodeId}-${index}`}
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

              {/* DETAILED BACKEND STEPS */}

              {executionSteps.length >
                0 && (
                <div className="mt-4">
                  <div className="small fw-semibold mb-2">
                    Backend Execution Details
                  </div>

                  <div className="list-group list-group-flush">
                    {executionSteps.map(
                      (
                        step,
                        index
                      ) => (
                        <div
                          key={`${step.nodeId}-${index}`}
                          className="list-group-item px-0"
                        >
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold">
                                {
                                  step.nodeType
                                }
                              </div>

                              <div className="small text-secondary">
                                {
                                  step.message
                                }
                              </div>
                            </div>

                            <span
                              className={`badge ${
                                step.status ===
                                "completed"
                                  ? "text-bg-success"
                                  : step.status ===
                                      "failed"
                                    ? "text-bg-danger"
                                    : "text-bg-secondary"
                              }`}
                            >
                              {
                                step.status
                              }
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
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