import { useState } from "react";
import type { Node } from "reactflow";

type NodeConfigPanelProps = {
  node: Node | null;
  onUpdateNode: (
    nodeId: string,
    data: Record<string, unknown>
  ) => void;
};

const NodeConfigPanel = ({
  node,
  onUpdateNode,
}: NodeConfigPanelProps) => {
  const [label, setLabel] = useState(
    node?.data.label ?? ""
  );

  const [description, setDescription] = useState(
    node?.data.description ?? ""
  );

  const [model, setModel] = useState(
    node?.data.model ?? "Gemini"
  );

  const [temperature, setTemperature] = useState(
    node?.data.temperature ?? "0.2"
  );

  const [instructions, setInstructions] =
    useState(
      node?.data.instructions ??
        "Analyze the input and return structured, accurate results."
    );

  const [outputFormat, setOutputFormat] =
    useState(
      node?.data.outputFormat ?? "JSON"
    );

  const [conditionField, setConditionField] =
    useState(
      node?.data.conditionField ??
        "Candidate Score"
    );

  const [conditionOperator, setConditionOperator] =
    useState(
      node?.data.conditionOperator ?? ">="
    );

  const [conditionValue, setConditionValue] =
    useState(
      node?.data.conditionValue ?? "70"
    );

  const [emailTemplate, setEmailTemplate] =
    useState(
      node?.data.emailTemplate ??
        "Shortlist Email"
    );

  const [recipient, setRecipient] = useState(
    node?.data.recipient ??
      "candidate@email.com"
  );

  const [subject, setSubject] = useState(
    node?.data.subject ??
      "Congratulations! You have been shortlisted"
  );

  const [emailBody, setEmailBody] = useState(
    node?.data.emailBody ??
      "Hi {{candidateName}},\n\nWe are pleased to inform you that your application has been shortlisted for the next stage of the recruitment process.\n\nBest regards,\nRecruitment Team"
  );

  const [triggerType, setTriggerType] =
    useState(
      node?.data.triggerType ??
        "New Candidate Application"
    );

  const [actionStatus, setActionStatus] =
    useState(
      node?.data.actionStatus ?? "Ready"
    );

  const [actionReason, setActionReason] =
    useState(
      node?.data.actionReason ??
        "Candidate passed the required evaluation criteria."
    );

  if (!node) {
    return (
      <div className="node-config-panel">
        <div className="node-config-empty">
          <div className="node-config-empty-icon">
            ◈
          </div>

          <h5>Node Configuration</h5>

          <p>
            Select a node from the canvas to configure
            its settings.
          </p>
        </div>
      </div>
    );
  }

  const nodeType = node.data.nodeType;

  const isAiAgent =
    nodeType === "resume-parser" ||
    nodeType === "job-matching" ||
    nodeType === "score";

  const isCondition = nodeType === "condition";

  const isEmail = nodeType === "email";

  const isAction =
    nodeType === "shortlist" ||
    nodeType === "reject";

  const isTrigger = nodeType === "trigger";

  const getNodeIcon = () => {
    switch (nodeType) {
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
    switch (nodeType) {
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

  const handleSave = () => {
    onUpdateNode(node.id, {
      label,
      description,

      triggerType,

      model,
      temperature,
      instructions,
      outputFormat,

      conditionField,
      conditionOperator,
      conditionValue,

      emailTemplate,
      recipient,
      subject,
      emailBody,

      actionStatus,
      actionReason,
    });
  };

  return (
    <div className="node-config-panel">
      <div className="node-config-header">
        <div>
          <div className="node-config-heading">
            Node Configuration
          </div>

          <div className="node-config-subheading">
            Configure selected node
          </div>
        </div>

        <span className="node-config-close">
          ×
        </span>
      </div>

      <div className="node-config-selected">
        <div className="node-config-selected-icon">
          {getNodeIcon()}
        </div>

        <div className="node-config-selected-info">
          <div className="node-config-selected-category">
            {getNodeCategory()}
          </div>

          <div className="node-config-selected-name">
            {node.data.label}
          </div>
        </div>
      </div>

      <div className="node-config-content">
        <div className="node-config-section">
          <div className="node-config-section-title">
            General
          </div>

          <div className="node-config-field">
            <label htmlFor="node-name">
              Node Name
            </label>

            <input
              id="node-name"
              type="text"
              value={label}
              onChange={(event) =>
                setLabel(event.target.value)
              }
              placeholder="Enter node name"
            />
          </div>

          <div className="node-config-field">
            <label htmlFor="node-description">
              Description
            </label>

            <textarea
              id="node-description"
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what this node does..."
            />
          </div>
        </div>

        {isTrigger && (
          <div className="node-config-section">
            <div className="node-config-section-title">
              Trigger Configuration
            </div>

            <div className="trigger-info">
              <div className="trigger-info-icon">
                ⚡
              </div>

              <div>
                <div className="trigger-info-title">
                  Workflow Start
                </div>

                <div className="trigger-info-text">
                  Choose what event should start this
                  workflow.
                </div>
              </div>
            </div>

            <div className="node-config-field">
              <label htmlFor="trigger-type">
                Trigger Event
              </label>

              <select
                id="trigger-type"
                value={triggerType}
                onChange={(event) =>
                  setTriggerType(event.target.value)
                }
              >
                <option value="New Candidate Application">
                  New Candidate Application
                </option>

                <option value="Manual Trigger">
                  Manual Trigger
                </option>

                <option value="Webhook">
                  Webhook
                </option>
              </select>
            </div>

            <div className="trigger-status">
              <span className="trigger-status-dot" />

              <div>
                <div className="trigger-status-title">
                  Trigger is ready
                </div>

                <div className="trigger-status-text">
                  Workflow will start when the selected
                  event occurs.
                </div>
              </div>
            </div>
          </div>
        )}

        {isAiAgent && (
          <div className="node-config-section">
            <div className="node-config-section-title">
              AI Configuration
            </div>

            <div className="node-config-field">
              <label htmlFor="ai-model">
                AI Model
              </label>

              <select
                id="ai-model"
                value={model}
                onChange={(event) =>
                  setModel(event.target.value)
                }
              >
                <option value="Gemini">
                  Gemini
                </option>

                <option value="OpenAI">
                  OpenAI
                </option>
              </select>
            </div>

            <div className="node-config-field">
              <label htmlFor="ai-instructions">
                Instructions
              </label>

              <textarea
                id="ai-instructions"
                rows={5}
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                placeholder="Tell the AI what to do..."
              />

              <small className="node-config-help">
                Define the task this AI agent should
                perform.
              </small>
            </div>

            <div className="node-config-field">
              <label htmlFor="ai-temperature">
                Temperature
              </label>

              <select
                id="ai-temperature"
                value={temperature}
                onChange={(event) =>
                  setTemperature(event.target.value)
                }
              >
                <option value="0">
                  0 — Precise
                </option>

                <option value="0.2">
                  0.2 — Focused
                </option>

                <option value="0.5">
                  0.5 — Balanced
                </option>

                <option value="0.8">
                  0.8 — Creative
                </option>
              </select>
            </div>

            <div className="node-config-field">
              <label htmlFor="output-format">
                Output Format
              </label>

              <select
                id="output-format"
                value={outputFormat}
                onChange={(event) =>
                  setOutputFormat(event.target.value)
                }
              >
                <option value="JSON">
                  JSON
                </option>

                <option value="Text">
                  Text
                </option>
              </select>
            </div>
          </div>
        )}

        {isCondition && (
          <div className="node-config-section">
            <div className="node-config-section-title">
              Condition Rule
            </div>

            <div className="condition-preview">
              <span>IF</span>

              <strong>
                {conditionField}
              </strong>

              <strong>
                {conditionOperator}
              </strong>

              <strong>
                {conditionValue || "0"}
              </strong>
            </div>

            <div className="node-config-field">
              <label htmlFor="condition-field">
                Field
              </label>

              <select
                id="condition-field"
                value={conditionField}
                onChange={(event) =>
                  setConditionField(event.target.value)
                }
              >
                <option value="Candidate Score">
                  Candidate Score
                </option>

                <option value="Match Score">
                  Match Score
                </option>

                <option value="Experience">
                  Experience
                </option>
              </select>
            </div>

            <div className="node-config-field">
              <label htmlFor="condition-operator">
                Operator
              </label>

              <select
                id="condition-operator"
                value={conditionOperator}
                onChange={(event) =>
                  setConditionOperator(event.target.value)
                }
              >
                <option value=">=">
                  Greater than or equal to
                </option>

                <option value=">">
                  Greater than
                </option>

                <option value="=">
                  Equal to
                </option>

                <option value="<">
                  Less than
                </option>

                <option value="<=">
                  Less than or equal to
                </option>
              </select>
            </div>

            <div className="node-config-field">
              <label htmlFor="condition-value">
                Value
              </label>

              <input
                id="condition-value"
                type="number"
                value={conditionValue}
                onChange={(event) =>
                  setConditionValue(event.target.value)
                }
                placeholder="70"
              />
            </div>

            <div className="condition-branches">
              <div className="condition-branch yes">
                <span className="condition-branch-dot" />

                <span>YES</span>

                <small>
                  Condition is true
                </small>
              </div>

              <div className="condition-branch no">
                <span className="condition-branch-dot" />

                <span>NO</span>

                <small>
                  Condition is false
                </small>
              </div>
            </div>
          </div>
        )}

        {isEmail && (
          <div className="node-config-section">
            <div className="node-config-section-title">
              Email Configuration
            </div>

            <div className="node-config-field">
              <label htmlFor="email-template">
                Email Template
              </label>

              <select
                id="email-template"
                value={emailTemplate}
                onChange={(event) =>
                  setEmailTemplate(event.target.value)
                }
              >
                <option value="Shortlist Email">
                  Shortlist Email
                </option>

                <option value="Rejection Email">
                  Rejection Email
                </option>

                <option value="Interview Invitation">
                  Interview Invitation
                </option>

                <option value="Custom Email">
                  Custom Email
                </option>
              </select>
            </div>

            <div className="node-config-field">
              <label htmlFor="email-recipient">
                Recipient
              </label>

              <input
                id="email-recipient"
                type="email"
                value={recipient}
                onChange={(event) =>
                  setRecipient(event.target.value)
                }
                placeholder="candidate@email.com"
              />

              <small className="node-config-help">
                You can later use workflow variables
                such as {"{{candidateEmail}}"}.
              </small>
            </div>

            <div className="node-config-field">
              <label htmlFor="email-subject">
                Subject
              </label>

              <input
                id="email-subject"
                type="text"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="Enter email subject"
              />
            </div>

            <div className="node-config-field">
              <label htmlFor="email-body">
                Email Body
              </label>

              <textarea
                id="email-body"
                rows={7}
                value={emailBody}
                onChange={(event) =>
                  setEmailBody(event.target.value)
                }
                placeholder="Write your email..."
              />

              <small className="node-config-help">
                Use variables like {"{{candidateName}}"}{" "}
                or {"{{candidateEmail}}"}.
              </small>
            </div>

            <div className="email-preview">
              <div className="email-preview-label">
                PREVIEW
              </div>

              <div className="email-preview-subject">
                {subject}
              </div>

              <div className="email-preview-body">
                {emailBody}
              </div>
            </div>
          </div>
        )}

        {isAction && (
          <div className="node-config-section">
            <div className="node-config-section-title">
              Action Configuration
            </div>

            <div className="action-status-card">
              <div className="action-status-icon">
                {nodeType === "shortlist" ? "✓" : "×"}
              </div>

              <div>
                <div className="action-status-title">
                  {nodeType === "shortlist"
                    ? "Candidate will be shortlisted"
                    : "Candidate will be rejected"}
                </div>

                <div className="action-status-text">
                  This action will be executed when the
                  workflow reaches this node.
                </div>
              </div>
            </div>

            <div className="node-config-field">
              <label htmlFor="action-status">
                Action Status
              </label>

              <select
                id="action-status"
                value={actionStatus}
                onChange={(event) =>
                  setActionStatus(event.target.value)
                }
              >
                <option value="Ready">
                  Ready
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Disabled">
                  Disabled
                </option>
              </select>
            </div>

            <div className="node-config-field">
              <label htmlFor="action-reason">
                Reason
              </label>

              <textarea
                id="action-reason"
                rows={4}
                value={actionReason}
                onChange={(event) =>
                  setActionReason(event.target.value)
                }
                placeholder="Enter the reason for this action..."
              />

              <small className="node-config-help">
                This reason can be stored in the execution
                log and candidate record.
              </small>
            </div>

            <div
              className={`action-result ${
                nodeType === "shortlist"
                  ? "action-result-success"
                  : "action-result-danger"
              }`}
            >
              <span>
                {nodeType === "shortlist" ? "✓" : "×"}
              </span>

              <div>
                <div className="action-result-title">
                  Result
                </div>

                <div className="action-result-text">
                  {nodeType === "shortlist"
                    ? "Candidate status will become Shortlisted."
                    : "Candidate status will become Rejected."}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="node-config-section">
          <div className="node-config-section-title">
            Node Information
          </div>

          <div className="node-config-info-row">
            <span>Type</span>

            <span className="node-config-info-value">
              {getNodeCategory()}
            </span>
          </div>

          <div className="node-config-info-row">
            <span>Status</span>

            <span className="node-config-active">
              Active
            </span>
          </div>

          <div className="node-config-info-row">
            <span>ID</span>

            <span className="node-config-id">
              {node.id}
            </span>
          </div>
        </div>
      </div>

      <div className="node-config-footer">
        <button
          type="button"
          className="node-config-save"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NodeConfigPanel;