import Candidate from "../models/candidate.model.js";
import ExecutionLog from "../models/execution-log.model.js";
import { matchCandidateToJob } from "./ai/job-matching.service.js";
import { sendEmail } from "./email.service.js";

interface WorkflowNode {
  id: string;
  type?: string;

  data?: {
    label?: string;
    description?: string;
    nodeType?: string;
    conditionOperator?: string;
    conditionValue?: number;
  };
}

interface WorkflowEdge {
  source: string;
  target: string;
  sourceHandle?: string;
}

interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  status: "completed" | "skipped" | "failed";
  message: string;
  data?: unknown;
}

interface WorkflowContext {
  resumeText: string;
  matchScore: number;
  matchingResult: Record<string, any> | null;
  finalStatus: "shortlisted" | "rejected" | null;
}

export const executeWorkflow = async (
  workflowId: string,
  candidateId: string,
  jobId: string,
  resumeText: string,
  jobTitle: string,
  jobDescription: string,
  jobSkills: string[],
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
) => {
  console.log("Starting dynamic workflow execution...");

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  const steps: ExecutionStep[] = [];

  const context: WorkflowContext = {
    resumeText,
    matchScore: 0,
    matchingResult: null,
    finalStatus: null,
  };

  const triggerNode = nodes.find(
    (node) =>
      node.data?.nodeType === "trigger" ||
      node.type === "trigger"
  );

  if (!triggerNode) {
    throw new Error("Workflow must contain a Trigger node");
  }

  const getNode = (
    nodeId: string
  ): WorkflowNode | undefined => {
    return nodes.find((node) => node.id === nodeId);
  };

  const findNextEdge = (
    nodeId: string,
    handle?: string
  ): WorkflowEdge | undefined => {
    const outgoingEdges = edges.filter(
      (edge) => edge.source === nodeId
    );

    if (handle) {
      return outgoingEdges.find(
        (edge) => edge.sourceHandle === handle
      );
    }

    return outgoingEdges[0];
  };

  const executeNode = async (
    node: WorkflowNode
  ): Promise<string | undefined> => {
    const nodeType =
      node.data?.nodeType ||
      node.type ||
      "unknown";

    console.log(
      `Executing node: ${node.data?.label || node.id}`
    );
switch (nodeType) {
  case "trigger": {
    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: "Workflow trigger started",
    });

    return findNextEdge(node.id)?.target;
  }

  case "resume-parser": {
    if (!context.resumeText.trim()) {
      throw new Error("Resume text is required");
    }

    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: "Resume parsed successfully",
    });

    return findNextEdge(node.id)?.target;
  }

  case "job-matching": {
    const matchingResult =
      await matchCandidateToJob(
        context.resumeText,
        jobTitle,
        jobDescription,
        jobSkills
      );

    context.matchingResult = matchingResult;

    context.matchScore = Number(
      matchingResult.matchScore || 0
    );

    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: "AI job matching completed",
      data: matchingResult,
    });

    return findNextEdge(node.id)?.target;
  }

  case "score": {
    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: `Candidate score: ${context.matchScore}`,
      data: {
        score: context.matchScore,
      },
    });

    return findNextEdge(node.id)?.target;
  }

  case "condition": {
    const conditionValue = Number(
      node.data?.conditionValue ?? 70
    );

    const operator =
      node.data?.conditionOperator ?? ">=";

    let conditionResult = false;

    switch (operator) {
      case ">=":
        conditionResult =
          context.matchScore >= conditionValue;
        break;

      case ">":
        conditionResult =
          context.matchScore > conditionValue;
        break;

      case "=":
      case "==":
        conditionResult =
          context.matchScore === conditionValue;
        break;

      case "<":
        conditionResult =
          context.matchScore < conditionValue;
        break;

      case "<=":
        conditionResult =
          context.matchScore <= conditionValue;
        break;

      default:
        conditionResult =
          context.matchScore >= conditionValue;
    }

    const selectedHandle =
      conditionResult ? "yes" : "no";

    const nextEdge = findNextEdge(
      node.id,
      selectedHandle
    );

    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: conditionResult
        ? `Condition passed: ${context.matchScore} ${operator} ${conditionValue}`
        : `Condition failed: ${context.matchScore} ${operator} ${conditionValue}`,
      data: {
        score: context.matchScore,
        operator,
        value: conditionValue,
        result: conditionResult,
        branch: selectedHandle,
      },
    });

    return nextEdge?.target;
  }

  case "shortlist": {
    context.finalStatus = "shortlisted";

    await Candidate.findByIdAndUpdate(
      candidateId,
      {
        status: "shortlisted",
        screeningScore: context.matchScore,
        feedback: String(
          context.matchingResult?.reason || ""
        ),
      }
    );

    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: "Candidate shortlisted",
    });

    return findNextEdge(node.id)?.target;
  }

  case "reject": {
    context.finalStatus = "rejected";

    await Candidate.findByIdAndUpdate(
      candidateId,
      {
        status: "rejected",
        screeningScore: context.matchScore,
        feedback: String(
          context.matchingResult?.reason || ""
        ),
      }
    );

    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: "Candidate rejected",
    });

    return findNextEdge(node.id)?.target;
  }

  case "email": {
    if (!context.finalStatus) {
      throw new Error(
        "Email node reached before shortlist/reject decision"
      );
    }

    const isShortlisted =
      context.finalStatus === "shortlisted";

    const subject = isShortlisted
      ? `Application Update - ${jobTitle}`
      : `Application Update - ${jobTitle}`;

    const message = isShortlisted
      ? `Hello ${candidate.name},

Thank you for applying for the ${jobTitle} position.

Your application has passed our initial screening and you have been shortlisted for the next stage.

We will contact you with the next steps.

Best regards,
AgentFlow Recruitment Team`
      : `Hello ${candidate.name},

Thank you for applying for the ${jobTitle} position.

After reviewing your application against the current job requirements, we will not be moving forward with your application at this stage.

We appreciate your time and interest.

Best regards,
AgentFlow Recruitment Team`;

    await sendEmail(
      candidate.email,
      subject,
      message
    );

    steps.push({
      nodeId: node.id,
      nodeType,
      status: "completed",
      message: `Email sent to ${candidate.email}`,
    });

    return findNextEdge(node.id)?.target;
  }

  default: {
    steps.push({
      nodeId: node.id,
      nodeType,
      status: "skipped",
      message: `Unknown node type: ${nodeType}`,
    });

    return findNextEdge(node.id)?.target;
  }
}
  };

  let currentNodeId: string | undefined =
    triggerNode.id;

  const visitedNodes = new Set<string>();

  while (currentNodeId) {
    if (visitedNodes.has(currentNodeId)) {
      throw new Error(
        "Workflow contains a circular connection"
      );
    }

    visitedNodes.add(currentNodeId);

    const currentNode =
      getNode(currentNodeId);

    if (!currentNode) {
      throw new Error(
        `Workflow node not found: ${currentNodeId}`
      );
    }

    currentNodeId =
      await executeNode(currentNode);
  }

  if (!context.finalStatus) {
    throw new Error(
      "Workflow finished without a final action"
    );
  }

  const finalMessage =
    context.finalStatus === "shortlisted"
      ? "Candidate shortlisted and notification workflow completed"
      : "Candidate rejected and notification workflow completed";

  const executionLog =
    await ExecutionLog.create({
      workflowId,
      candidateId,
      jobId,
      matchScore: context.matchScore,
      finalStatus: context.finalStatus,
      message: finalMessage,
      steps,
    });

  console.log(
    "Workflow execution completed successfully"
  );

  return {
    success: true,
    workflowId,
    candidateId,
    jobId,
    matchScore: context.matchScore,
    finalStatus: context.finalStatus,
    matchingResult: context.matchingResult,
    steps,
    executionLogId: executionLog._id,
  };
};