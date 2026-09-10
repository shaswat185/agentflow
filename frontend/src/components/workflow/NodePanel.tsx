import { useMemo, useState } from "react";

type NodePanelProps = {
  onAddNode: (
    type: string,
    label: string,
    description: string
  ) => void;
};

type WorkflowNodeOption = {
  type: string;
  label: string;
  description: string;
  category: string;
  icon: string;
};

const NodePanel = ({
  onAddNode,
}: NodePanelProps) => {
  const [search, setSearch] = useState("");

  const nodes: WorkflowNodeOption[] = [
    {
      type: "trigger",
      label: "Trigger",
      description: "Start the workflow",
      category: "Triggers",
      icon: "⚡",
    },
    {
      type: "resume-parser",
      label: "Resume Parser",
      description: "Extract candidate information",
      category: "AI Agents",
      icon: "✦",
    },
    {
      type: "job-matching",
      label: "Job Matching",
      description: "Match candidate with job",
      category: "AI Agents",
      icon: "⌁",
    },
    {
      type: "score",
      label: "Candidate Score",
      description: "Calculate candidate score",
      category: "AI Agents",
      icon: "◈",
    },
    {
      type: "condition",
      label: "Condition",
      description: "Check a condition",
      category: "Logic",
      icon: "◇",
    },
    {
      type: "shortlist",
      label: "Shortlist",
      description: "Move qualified candidate forward",
      category: "Actions",
      icon: "✓",
    },
    {
      type: "reject",
      label: "Reject",
      description: "Reject candidate from process",
      category: "Actions",
      icon: "×",
    },
    {
      type: "email",
      label: "Send Email",
      description: "Send an email",
      category: "Communication",
      icon: "✉",
    },
  ];

  const filteredNodes = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return nodes;
    }

    return nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query)
    );
  }, [search]);

  const categories = [
    "Triggers",
    "AI Agents",
    "Logic",
    "Actions",
    "Communication",
  ];

  return (
    <div className="node-library">
      <div className="node-library-header">
        <div>
          <h5 className="node-library-title">
            Node Library
          </h5>

          <p className="node-library-subtitle">
            Build your automation
          </p>
        </div>

        <span className="node-count">
          {filteredNodes.length}
        </span>
      </div>

      <div className="node-search-wrapper">
        <span className="node-search-icon">
          ⌕
        </span>

        <input
          type="text"
          className="node-search"
          placeholder="Search nodes..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <div className="node-library-content">
        {categories.map((category) => {
          const categoryNodes = filteredNodes.filter(
            (node) => node.category === category
          );

          if (categoryNodes.length === 0) {
            return null;
          }

          return (
            <div
              key={category}
              className="node-category"
            >
              <div className="node-category-title">
                {category}
              </div>

              <div className="node-category-items">
                {categoryNodes.map((node) => (
                  <button
                    key={node.type}
                    type="button"
                    className="node-library-item"
                    onClick={() =>
                      onAddNode(
                        node.type,
                        node.label,
                        node.description
                      )
                    }
                  >
                    <div className="node-library-icon">
                      {node.icon}
                    </div>

                    <div className="node-library-info">
                      <div className="node-library-label">
                        {node.label}
                      </div>

                      <div className="node-library-description">
                        {node.description}
                      </div>
                    </div>

                    <span className="node-add-icon">
                      +
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="node-empty">
            <div className="node-empty-icon">
              ⌕
            </div>

            <div className="fw-semibold">
              No nodes found
            </div>

            <small>
              Try another search term.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodePanel;