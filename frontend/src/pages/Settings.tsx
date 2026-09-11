import { useState } from "react";

const Settings = () => {
  const [workspaceName, setWorkspaceName] =
    useState("AgentFlow");
  const [emailNotifications, setEmailNotifications] =
    useState(true);
  const [executionNotifications, setExecutionNotifications] =
    useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Settings</h2>
        <p className="text-muted mb-0">
          Manage your AgentFlow workspace preferences.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-1">Workspace</h5>
              <p className="text-muted small mb-4">
                Configure your AgentFlow workspace.
              </p>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Workspace Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={workspaceName}
                  onChange={(event) =>
                    setWorkspaceName(event.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Workspace ID
                </label>

                <input
                  type="text"
                  className="form-control"
                  value="agentflow-demo"
                  disabled
                />

                <small className="text-muted">
                  Workspace ID cannot be changed.
                </small>
              </div>

              <hr className="my-4" />

              <h5 className="mb-1">Notifications</h5>
              <p className="text-muted small mb-4">
                Choose which notifications you want to receive.
              </p>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={(event) =>
                    setEmailNotifications(
                      event.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="emailNotifications"
                >
                  <strong>Email notifications</strong>
                  <span className="d-block text-muted small">
                    Receive important workspace notifications.
                  </span>
                </label>
              </div>

              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="executionNotifications"
                  checked={executionNotifications}
                  onChange={(event) =>
                    setExecutionNotifications(
                      event.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="executionNotifications"
                >
                  <strong>Execution notifications</strong>
                  <span className="d-block text-muted small">
                    Get notified when workflow executions finish.
                  </span>
                </label>
              </div>

              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>

                {saved && (
                  <span className="text-success small fw-semibold">
                    ✓ Changes saved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-3">Workspace Status</h5>

              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">
                  Workflows
                </span>
                <strong>12</strong>
              </div>

              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">
                  Candidates
                </span>
                <strong>248</strong>
              </div>

              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">
                  Executions
                </span>
                <strong>1,284</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  System
                </span>

                <span className="badge text-bg-success">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;