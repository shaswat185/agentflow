import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI Recruitment Agents",
      description:
        "Use AI agents to parse resumes, understand job requirements, evaluate candidates, and automate recruitment tasks.",
    },
    {
      icon: "🔗",
      title: "Visual Workflow Builder",
      description:
        "Connect triggers, AI agents, conditions, and actions in a visual workflow without complicated configuration.",
    },
    {
      icon: "🎯",
      title: "Candidate Matching",
      description:
        "Automatically compare candidate profiles with job requirements and identify the strongest matches.",
    },
    {
      icon: "📊",
      title: "AI Candidate Scoring",
      description:
        "Give candidates consistent AI-powered scores based on skills, experience, and job requirements.",
    },
    {
      icon: "⚡",
      title: "Automated Actions",
      description:
        "Trigger emails, notifications, scheduling actions, and other recruitment operations automatically.",
    },
    {
      icon: "📋",
      title: "Execution Monitoring",
      description:
        "Track every workflow execution and see exactly what happened at each step.",
    },
  ];

  const workflowSteps = [
    {
      number: "01",
      title: "Create your workflow",
      description:
        "Start with a trigger and visually define the recruitment process you want to automate.",
    },
    {
      number: "02",
      title: "Connect AI agents",
      description:
        "Add AI-powered nodes for resume parsing, candidate matching, scoring, and evaluation.",
    },
    {
      number: "03",
      title: "Run & monitor",
      description:
        "Execute your workflow and monitor each node through detailed execution logs.",
    },
  ];

  const recruitmentSteps = [
    {
      title: "Resume Parser AI",
      description: "Extract skills, experience and candidate information.",
      icon: "📄",
    },
    {
      title: "Job Matching AI",
      description: "Compare candidate information against job requirements.",
      icon: "🎯",
    },
    {
      title: "Candidate Score",
      description: "Generate an AI-powered candidate score.",
      icon: "📊",
    },
    {
      title: "Condition",
      description: "Make automated decisions based on configurable rules.",
      icon: "◇",
    },
    {
      title: "Recruiter Action",
      description: "Shortlist, reject or continue with the next recruitment step.",
      icon: "⚡",
    },
  ];

  return (
    <div className="agentflow-home">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container py-2">
          <Link
            to="/"
            className="navbar-brand text-dark text-decoration-none"
          >
            <span className="agentflow-logo">
              Agent<span>Flow</span>
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#agentflowNavbar"
            aria-controls="agentflowNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse"
            id="agentflowNavbar"
          >
            <div className="navbar-nav mx-auto gap-lg-3">
              <a
                href="#how-it-works"
                className="nav-link agentflow-nav-link"
              >
                How it works
              </a>

              <a
                href="#features"
                className="nav-link agentflow-nav-link"
              >
                Features
              </a>

              <a
                href="#workflow"
                className="nav-link agentflow-nav-link"
              >
                Workflow
              </a>
            </div>

            <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
              <Link
                to="/login"
                className="btn btn-light border px-4"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary px-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="agentflow-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="agentflow-hero-badge">
                <span className="agentflow-live-dot" />
                AI Recruitment Automation
              </div>

              <h1 className="agentflow-hero-title">
                Build recruitment workflows powered by{" "}
                <span>AI Agents.</span>
              </h1>

              <p className="agentflow-hero-description">
                Automate resume screening, candidate matching, scoring,
                communication, and repetitive recruitment operations with
                visual AI workflows.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg px-4"
                >
                  Start Building
                  <span className="ms-2">→</span>
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-dark btn-lg px-4"
                >
                  Explore Platform
                </Link>
              </div>

              <div className="agentflow-hero-points">
                <span>✓ Visual workflow builder</span>
                <span>✓ AI-powered automation</span>
                <span>✓ Execution monitoring</span>
              </div>
            </div>

            {/* Product Preview */}
            <div className="col-lg-6">
              <div className="agentflow-product-preview">
                <div className="agentflow-window-top">
                  <div className="agentflow-window-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span className="agentflow-window-title">
                    Candidate Screening
                  </span>

                  <span className="agentflow-active-badge">
                    Active
                  </span>
                </div>

                <div className="agentflow-canvas-preview">
                  <div className="agentflow-canvas-grid">
                    <div className="agentflow-preview-node">
                      <div className="agentflow-preview-icon trigger">
                        ⚡
                      </div>

                      <div>
                        <strong>New Application</strong>
                        <small>Trigger</small>
                      </div>

                      <span className="agentflow-check">✓</span>
                    </div>

                    <div className="agentflow-preview-line" />

                    <div className="agentflow-preview-node">
                      <div className="agentflow-preview-icon ai">
                        🤖
                      </div>

                      <div>
                        <strong>Resume Parser AI</strong>
                        <small>Extract candidate data</small>
                      </div>

                      <span className="agentflow-check">✓</span>
                    </div>

                    <div className="agentflow-preview-line" />

                    <div className="agentflow-preview-node">
                      <div className="agentflow-preview-icon match">
                        🎯
                      </div>

                      <div>
                        <strong>Job Matching AI</strong>
                        <small>Match job requirements</small>
                      </div>

                      <span className="agentflow-check">✓</span>
                    </div>

                    <div className="agentflow-preview-line" />

                    <div className="agentflow-preview-node">
                      <div className="agentflow-preview-icon score">
                        📊
                      </div>

                      <div>
                        <strong>Candidate Score</strong>
                        <small>AI evaluation</small>
                      </div>

                      <span className="agentflow-score-value">
                        82
                      </span>
                    </div>

                    <div className="agentflow-preview-line" />

                    <div className="agentflow-condition-preview">
                      <div className="agentflow-condition-heading">
                        <span>◇</span>
                        <strong>Condition</strong>
                        <small>Score ≥ 70</small>
                      </div>

                      <div className="agentflow-condition-branches">
                        <div className="agentflow-branch-preview yes">
                          <strong>YES</strong>
                          <span>Shortlist</span>
                        </div>

                        <div className="agentflow-branch-preview no">
                          <strong>NO</strong>
                          <span>Reject</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="agentflow-preview-footer">
                  <span>
                    <strong>5</strong> nodes
                  </span>

                  <span>
                    Execution <strong>2.8s</strong>
                  </span>

                  <span className="text-success">
                    ● Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="agentflow-metrics">
        <div className="container">
          <div className="row g-0">
            <div className="col-6 col-lg-3">
              <div className="agentflow-metric">
                <strong>AI</strong>
                <span>Powered workflows</span>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="agentflow-metric">
                <strong>24/7</strong>
                <span>Automation</span>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="agentflow-metric">
                <strong>100%</strong>
                <span>Workflow visibility</span>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="agentflow-metric">
                <strong>1</strong>
                <span>Unified platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="agentflow-section agentflow-light-section"
      >
        <div className="container">
          <div className="agentflow-section-heading">
            <span>HOW IT WORKS</span>

            <h2>
              Turn repetitive recruitment tasks into
              automated workflows.
            </h2>

            <p>
              AgentFlow gives recruitment teams a visual way to
              design, automate, and monitor their processes.
            </p>
          </div>

          <div className="row g-4">
            {workflowSteps.map((step) => (
              <div className="col-md-4" key={step.number}>
                <div className="agentflow-step-card">
                  <div className="agentflow-step-number">
                    {step.number}
                  </div>

                  <h5>{step.title}</h5>

                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Workflow */}
      <section
        id="workflow"
        className="agentflow-section"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="agentflow-section-heading text-start mb-0">
                <span>RECRUITMENT AUTOMATION</span>

                <h2>
                  One workflow.
                  <br />
                  Multiple AI agents.
                </h2>

                <p>
                  Build a complete candidate screening pipeline
                  by connecting specialized AI agents and
                  automated actions.
                </p>
              </div>

              <Link
                to="/register"
                className="btn btn-primary px-4 mt-4"
              >
                Build a Workflow →
              </Link>
            </div>

            <div className="col-lg-7">
              <div className="agentflow-recruitment-flow">
                {recruitmentSteps.map((step, index) => (
                  <div key={step.title}>
                    <div className="agentflow-recruitment-node">
                      <div className="agentflow-recruitment-icon">
                        {step.icon}
                      </div>

                      <div className="flex-grow-1">
                        <strong>{step.title}</strong>
                        <p>{step.description}</p>
                      </div>

                      <span className="agentflow-node-arrow">
                        →
                      </span>
                    </div>

                    {index !== recruitmentSteps.length - 1 && (
                      <div className="agentflow-recruitment-connector" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="agentflow-section agentflow-light-section"
      >
        <div className="container">
          <div className="agentflow-section-heading">
            <span>POWERFUL FEATURES</span>

            <h2>
              Everything you need to automate recruitment.
            </h2>

            <p>
              From AI-powered candidate analysis to workflow
              execution monitoring.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-md-6 col-lg-4" key={feature.title}>
                <div className="agentflow-feature-card">
                  <div className="agentflow-feature-icon">
                    {feature.icon}
                  </div>

                  <h5>{feature.title}</h5>

                  <p>{feature.description}</p>

                  <span className="agentflow-feature-link">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="agentflow-section">
        <div className="container">
          <div className="agentflow-section-heading">
            <span>BUILT FOR RECRUITMENT TEAMS</span>

            <h2>
              Automate the work.
              <br />
              Keep humans in control.
            </h2>

            <p>
              AgentFlow handles repetitive recruitment operations
              while recruiters stay responsible for important
              hiring decisions.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="agentflow-usecase-card">
                <span className="agentflow-usecase-icon">
                  📥
                </span>

                <h5>Screen applications</h5>

                <p>
                  Automatically process incoming resumes and
                  extract relevant candidate information.
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="agentflow-usecase-card">
                <span className="agentflow-usecase-icon">
                  🧠
                </span>

                <h5>Evaluate candidates</h5>

                <p>
                  Use AI agents to compare candidates with job
                  requirements and generate consistent scores.
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="agentflow-usecase-card">
                <span className="agentflow-usecase-icon">
                  📅
                </span>

                <h5>Automate follow-ups</h5>

                <p>
                  Continue your workflow with communication,
                  scheduling, reminders, and other actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="agentflow-cta-section">
        <div className="container">
          <div className="agentflow-cta">
            <div>
              <span>START AUTOMATING</span>

              <h2>
                Build your first AI recruitment workflow.
              </h2>

              <p>
                Create, connect, and run AI agents from one
                visual platform.
              </p>
            </div>

            <Link
              to="/register"
              className="btn btn-light btn-lg px-4"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="agentflow-footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <Link
                to="/"
                className="text-decoration-none"
              >
                <div className="agentflow-footer-logo">
                  Agent<span>Flow</span>
                </div>
              </Link>

              <p>
                AI-powered recruitment automation through
                visual workflows and intelligent agents.
              </p>
            </div>

            <div className="col-6 col-lg-2">
              <h6>Platform</h6>

              <Link to="/workflows">Workflows</Link>
              <Link to="/templates">Templates</Link>
              <Link to="/executions">Executions</Link>
            </div>

            <div className="col-6 col-lg-2">
              <h6>Recruitment</h6>

              <Link to="/jobs">Jobs</Link>
              <Link to="/candidates">Candidates</Link>
              <Link to="/integrations">Integrations</Link>
            </div>

            <div className="col-6 col-lg-2">
              <h6>Account</h6>

              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          <div className="agentflow-footer-bottom">
            <span>
              © 2026 AgentFlow. All rights reserved.
            </span>

            <span>
              AI Recruitment Automation
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;