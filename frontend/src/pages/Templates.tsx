import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: number;
  popularity: string;
  tags: string[];
};

const templates: Template[] = [
  {
    id: "resume-screening-template",
    name: "AI Resume Screening",
    description:
      "Automatically parse resumes, match candidates with job requirements, score candidates and shortlist qualified applicants.",
    category: "Recruitment",
    nodes: 9,
    popularity: "Popular",
    tags: ["Resume", "AI", "Scoring"],
  },
  {
    id: "candidate-email-template",
    name: "Candidate Email Automation",
    description:
      "Automatically send personalized emails to candidates based on their recruitment status.",
    category: "Communication",
    nodes: 4,
    popularity: "Popular",
    tags: ["Email", "Candidates"],
  },
  {
    id: "interview-scheduling-template",
    name: "Interview Scheduling",
    description:
      "Automate interview invitations, scheduling and candidate notifications.",
    category: "Interview",
    nodes: 6,
    popularity: "New",
    tags: ["Interview", "Calendar"],
  },
  {
    id: "candidate-ranking-template",
    name: "Candidate Ranking",
    description:
      "Evaluate and rank candidates based on skills, experience and job requirements.",
    category: "Recruitment",
    nodes: 7,
    popularity: "Recommended",
    tags: ["AI", "Ranking", "Scoring"],
  },
  {
    id: "rejection-template",
    name: "Candidate Rejection",
    description:
      "Automatically notify candidates who do not meet the configured recruitment criteria.",
    category: "Communication",
    nodes: 4,
    popularity: "Simple",
    tags: ["Email", "Automation"],
  },
  {
    id: "full-recruitment-template",
    name: "Full Recruitment Pipeline",
    description:
      "A complete recruitment automation flow from candidate screening through interview and final evaluation.",
    category: "Advanced",
    nodes: 15,
    popularity: "Advanced",
    tags: ["AI", "Recruitment", "Interview"],
  },
];

const Templates = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedTemplate, setSelectedTemplate] =
    useState<Template | null>(null);

  const categories = useMemo(() => {
    return Array.from(
      new Set(templates.map((template) => template.category))
    );
  }, []);

  const filteredTemplates = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return templates.filter((template) => {
      const matchesSearch =
        !searchValue ||
        template.name.toLowerCase().includes(searchValue) ||
        template.description
          .toLowerCase()
          .includes(searchValue) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchValue)
        );

      const matchesCategory =
        category === "All" ||
        template.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleUseTemplate = (template: Template) => {
    if (
      template.id === "resume-screening-template"
    ) {
      navigate("/workflows/resume-screening");
      return;
    }

    navigate("/workflows/new");
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Templates</h2>

          <p className="text-secondary mb-0">
            Start building faster with ready-to-use workflow
            templates.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-dark"
          onClick={() => navigate("/workflows/new")}
        >
          + Create Workflow
        </button>
      </div>

      {/* FILTERS */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search templates..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-lg-4">
              <select
                className="form-select"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TEMPLATE GRID */}
      {filteredTemplates.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="fs-1 mb-3">🧩</div>

            <h5>No templates found</h5>

            <p className="text-secondary mb-0">
              Try a different search or category.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredTemplates.map((template) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={template.id}
            >
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center bg-light"
                      style={{
                        width: 48,
                        height: 48,
                        fontSize: 22,
                      }}
                    >
                      ⚡
                    </div>

                    <span className="badge bg-light text-dark border">
                      {template.popularity}
                    </span>
                  </div>

                  <div className="small text-primary fw-semibold mb-2">
                    {template.category}
                  </div>

                  <h5 className="fw-bold mb-2">
                    {template.name}
                  </h5>

                  <p className="text-secondary small flex-grow-1">
                    {template.description}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-secondary-subtle text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-secondary">
                      {template.nodes} nodes
                    </span>

                    <span className="small text-secondary">
                      Ready to use
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary flex-fill"
                      onClick={() =>
                        setSelectedTemplate(template)
                      }
                    >
                      Preview
                    </button>

                    <button
                      type="button"
                      className="btn btn-dark flex-fill"
                      onClick={() =>
                        handleUseTemplate(template)
                      }
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {selectedTemplate && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">
                    {selectedTemplate.name}
                  </h5>

                  <div className="small text-secondary">
                    {selectedTemplate.category}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setSelectedTemplate(null)
                  }
                />
              </div>

              <div className="modal-body">
                <p className="text-secondary">
                  {selectedTemplate.description}
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-secondary">
                        Nodes
                      </div>

                      <div className="fs-4 fw-bold">
                        {selectedTemplate.nodes}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-secondary">
                        Category
                      </div>

                      <div className="fw-semibold mt-1">
                        {selectedTemplate.category}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="border rounded p-3">
                      <div className="small text-secondary">
                        Status
                      </div>

                      <div className="fw-semibold mt-1 text-success">
                        Ready
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold mb-3">
                  Included capabilities
                </h6>

                <div className="d-flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge bg-light text-dark border p-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    setSelectedTemplate(null)
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Use Template →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;