const Templates = () => {
  const templates = [
    {
      title: "AI Candidate Screening",
      description:
        "Automatically parse resumes, match candidates with job requirements, score candidates, and shortlist qualified applicants.",
      category: "Recruitment",
      nodes: 7,
      popular: true,
    },
    {
      title: "Resume Processing",
      description:
        "Extract structured candidate information from uploaded resumes using an AI resume parser.",
      category: "AI Automation",
      nodes: 3,
      popular: false,
    },
    {
      title: "Candidate Evaluation",
      description:
        "Evaluate candidate profiles against job requirements and generate an overall candidate score.",
      category: "Recruitment",
      nodes: 5,
      popular: false,
    },
    {
      title: "Interview Scheduling",
      description:
        "Automatically send interview invitations and handle interview scheduling workflows.",
      category: "Interview",
      nodes: 6,
      popular: false,
    },
    {
      title: "Candidate Rejection",
      description:
        "Automatically notify candidates when they do not meet the required screening criteria.",
      category: "Communication",
      nodes: 4,
      popular: false,
    },
    {
      title: "Complete Recruitment Pipeline",
      description:
        "A complete recruitment automation flow from resume screening to interview and final evaluation.",
      category: "Recruitment",
      nodes: 12,
      popular: true,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Templates</h2>
        <p className="text-muted mb-0">
          Start building faster with ready-made AI recruitment workflows.
        </p>
      </div>

      <div className="row g-4">
        {templates.map((template) => (
          <div className="col-md-6 col-xl-4" key={template.title}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge text-bg-light border">
                    {template.category}
                  </span>

                  {template.popular && (
                    <span className="badge text-bg-primary">
                      Popular
                    </span>
                  )}
                </div>

                <h5 className="mb-2">{template.title}</h5>

                <p className="text-muted small flex-grow-1">
                  {template.description}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    {template.nodes} nodes
                  </small>

                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;