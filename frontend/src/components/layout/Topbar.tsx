const Topbar = () => {
  return (
    <header className="bg-white border-bottom px-4 py-3">
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <h5 className="mb-0">AgentFlow</h5>
          <small className="text-muted">
            AI Recruitment Automation
          </small>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light border">
            🔔
          </button>

          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
              }}
            >
              S
            </div>

            <div>
              <div className="fw-semibold">Shaswat</div>
              <small className="text-muted">Admin</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;