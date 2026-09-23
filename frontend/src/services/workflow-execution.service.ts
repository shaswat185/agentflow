import Workflow from "../models/workflow.model.js";
import Candidate from "../models/candidate.model.js";
import Job from "../models/job.model.js";
import ExecutionLog from "../models/execution-log.model.js";
import { matchCandidateToJob } from "./job-matching.service.js";
import { sendEmail } from "./email.service.js";

interface WorkflowNode {
  id: string;
  type?: string;
  data?: {
    label?: string;
    description?: string;
    nodeType?: string;
    operator?: string;
    value?: number;
    conditionOperator?: string;
    conditionValue?: number;
  };
}

interface WorkflowEdge {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  status: "completed" | "skipped" | "failed";
  message: string;
  data?: unknown;
}

interface WorkflowContext {
  resumeText: string;
  matchScore: number;
  matchingResult: unknown;
  finalStatus: "shortlisted" | "rejected" | null;
}

const getNodeType = (node: WorkflowNode): string => {
  return node.data?.nodeType || node.type || "";
};

const getNextEdge = (
  currentNodeId: string,
  edges: WorkflowEdge[],
  handle?: string
): WorkflowEdge | undefined => {
  return edges.find((edge) => {
    if (edge.source !== currentNodeId) {
      return false;
    }

    if (handle) {
      return edge.sourceHandle === handle;
    }

    return true;
  });
};

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
  const steps: ExecutionStep[] = [];

  const context: WorkflowContext = {
    resumeText,
    matchScore: 0,
    matchingResult: null,
    finalStatus: null,
  };

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const triggerNode = nodes.find(
    (node) => getNodeType(node) === "trigger"
  );

  if (!triggerNode) {
    throw new Error("Workflow must contain a Trigger node");
  }

  let currentNode: WorkflowNode | undefined = triggerNode;
  const visitedNodes = new Set<string>();

  while (currentNode) {
    if (visitedNodes.has(currentNode.id)) {
      throw new Error("Workflow contains a cycle");
    }

    visitedNodes.add(currentNode.id);

    const nodeType = getNodeType(currentNode);

    try {
      switch (nodeType) {
        case "trigger": {
          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: "Workflow triggered successfully",
          });

          break;
        }

        case "resume-parser": {
          if (!context.resumeText.trim()) {
            throw new Error("Resume text is required");
          }

          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: "Resume parsed successfully",
          });

          break;
        }

        case "job-matching": {
          const matchingResult = await matchCandidateToJob(
            context.resumeText,
            jobTitle,
            jobDescription,
            jobSkills
          );

          context.matchingResult = matchingResult;
          context.matchScore = Number(
            (matchingResult as { matchScore?: number }).matchScore || 0
          );

          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: `Job matching completed with score ${context.matchScore}`,
            data: matchingResult,
          });

          break;
        }

        case "candidate-score": {
          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: `Candidate score: ${context.matchScore}`,
            data: {
              score: context.matchScore,
            },
          });

          break;
        }

        case "condition": {
          const operator =
            currentNode.data?.operator ||
            currentNode.data?.conditionOperator ||
            ">=";

          const conditionValue =
            currentNode.data?.value ??
            currentNode.data?.conditionValue ??
            70;

          let conditionResult = false;

          switch (operator) {
            case ">":
              conditionResult = context.matchScore > conditionValue;
              break;

            case ">=":
              conditionResult = context.matchScore >= conditionValue;
              break;

            case "<":
              conditionResult = context.matchScore < conditionValue;
              break;

            case "<=":
              conditionResult = context.matchScore <= conditionValue;
              break;

            case "===":
            case "=":
            case "==":
              conditionResult = context.matchScore === conditionValue;
              break;

            default:
              throw new Error(
                `Unsupported condition operator: ${operator}`
              );
          }

          const selectedHandle = conditionResult ? "yes" : "no";

          steps.push({
            nodeId: currentNode.id,
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
              selectedHandle,
            },
          });

          const conditionEdge = getNextEdge(
            currentNode.id,
            edges,
            selectedHandle
          );

          currentNode = conditionEdge
            ? nodes.find((node) => node.id === conditionEdge.target)
            : undefined;

          continue;
        }

        case "shortlist": {
          context.finalStatus = "shortlisted";

          candidate.status = "shortlisted";
          candidate.screeningScore = context.matchScore;
          candidate.feedback =
            "Candidate shortlisted based on the workflow matching score.";

          await candidate.save();

          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: "Candidate shortlisted successfully",
            data: {
              score: context.matchScore,
            },
          });

          break;
        }

        case "reject": {
          context.finalStatus = "rejected";

          candidate.status = "rejected";
          candidate.screeningScore = context.matchScore;
          candidate.feedback =
            "Candidate rejected based on the workflow matching score.";

          await candidate.save();

          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: "Candidate rejected",
            data: {
              score: context.matchScore,
            },
          });

          break;
        }

        case "shortlist-email": {
          if (!candidate.email) {
            steps.push({
              nodeId: currentNode.id,
              nodeType,
              status: "skipped",
              message: "Candidate email is not available",
            });

            break;
          }

          await sendEmail(
            candidate.email,
            "Application Update - Shortlisted",
            `Hi ${candidate.name},

Congratulations! Your application for ${jobTitle} has been shortlisted.

Your AI matching score is ${context.matchScore}.

Our team will contact you with the next steps.

Regards,
AgentFlow`
          );

          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: "Shortlist email sent successfully",
          });

          break;
        }

        case "reject-email": {
          if (!candidate.email) {
            steps.push({
              nodeId: currentNode.id,
              nodeType,
              status: "skipped",
              message: "Candidate email is not available",
            });

            break;
          }

          await sendEmail(
            candidate.email,
            "Application Update",
            `Hi ${candidate.name},

Thank you for your interest in the ${jobTitle} position.

After reviewing your application, we will not be moving forward with your application at this stage.

We appreciate your time and interest.

Regards,
AgentFlow`
          );

          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "completed",
            message: "Rejection email sent successfully",
          });

          break;
        }

        default: {
          steps.push({
            nodeId: currentNode.id,
            nodeType,
            status: "skipped",
            message: `Unsupported node type: ${nodeType}`,
          });

          break;
        }
      }

      if (
        nodeType === "shortlist" ||
        nodeType === "reject" ||
        nodeType === "shortlist-email" ||
        nodeType === "reject-email"
      ) {
        const nextEdge = getNextEdge(currentNode.id, edges);

        currentNode = nextEdge
          ? nodes.find((node) => node.id === nextEdge.target)
          : undefined;

        continue;
      }

      const nextEdge = getNextEdge(currentNode.id, edges);

      currentNode = nextEdge
        ? nodes.find((node) => node.id === nextEdge.target)
        : undefined;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Node execution failed";

      steps.push({
        nodeId: currentNode.id,
        nodeType,
        status: "failed",
        message,
      });

      throw error;
    }
  }

  const finalStatus = context.finalStatus;

  if (!finalStatus) {
    throw new Error("Workflow completed without a final status");
  }

  const executionLog = await ExecutionLog.create({
    workflowId,
    candidateId,
    jobId,
    matchScore: context.matchScore,
    finalStatus,
    message:
      finalStatus === "shortlisted"
        ? "Candidate successfully shortlisted"
        : "Candidate rejected by workflow",
    steps,
  });

  return {
    success: true,
    workflowId,
    candidateId,
    jobId,
    matchScore: context.matchScore,
    finalStatus,
    matchingResult: context.matchingResult,
    steps,
    executionLogId: executionLog._id.toString(),
  };
};