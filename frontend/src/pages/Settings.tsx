import { useEffect, useState } from "react";

type SettingsData = {
  fullName: string;
  email: string;
  companyName: string;
  timezone: string;
  emailNotifications: boolean;
  executionNotifications: boolean;
  candidateNotifications: boolean;
  autoSave: boolean;
  defaultScore: number;
};

const STORAGE_KEY = "agentflow-settings";

const defaultSettings: SettingsData = {
  fullName: "Shaswat Dubey",
  email: "shaswat@example.com",
  companyName: "AgentFlow",
  timezone: "Asia/Kolkata",
  emailNotifications: true,
  executionNotifications: true,
  candidateNotifications: true,
  autoSave: true,
  defaultScore: 70,
};

const Settings = () => {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) return;

    try {
      const parsed = JSON.parse(savedSettings);

      setSettings({
        ...defaultSettings,
        ...parsed,
      });
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );
    }
  }, []);

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all settings to their default values?"
    );

    if (!confirmed) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Settings</h2>

          <p className="text-secondary mb-0">
            Manage your AgentFlow workspace preferences.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-dark"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>

      {saved && (
        <div
          className="alert alert-success d-flex align-items-center gap-2"
          role="alert"
        >
          <span>✓</span>
          <span>Settings saved successfully.</span>
        </div>
      )}

      <div className="row g-4">
        {/* PROFILE */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-1">Profile</h5>

              <p className="text-secondary small mb-0">
                Update your personal information.
              </p>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={settings.fullName}
                    onChange={(event) =>
                      updateSetting(
                        "fullName",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={settings.email}
                    onChange={(event) =>
                      updateSetting(
                        "email",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* WORKSPACE */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-1">Workspace</h5>

              <p className="text-secondary small mb-0">
                Configure your recruitment workspace.
              </p>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Company / Workspace Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={settings.companyName}
                    onChange={(event) =>
                      updateSetting(
                        "companyName",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Timezone
                  </label>

                  <select
                    className="form-select"
                    value={settings.timezone}
                    onChange={(event) =>
                      updateSetting(
                        "timezone",
                        event.target.value
                      )
                    }
                  >
                    <option value="Asia/Kolkata">
                      India — Asia/Kolkata
                    </option>

                    <option value="America/New_York">
                      US Eastern
                    </option>

                    <option value="America/Los_Angeles">
                      US Pacific
                    </option>

                    <option value="Europe/London">
                      Europe — London
                    </option>

                    <option value="Asia/Singapore">
                      Asia — Singapore
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* AUTOMATION */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-1">Automation</h5>

              <p className="text-secondary small mb-0">
                Configure default workflow behavior.
              </p>
            </div>

            <div className="card-body">
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Default Candidate Score
                </label>

                <div className="d-flex align-items-center gap-3">
                  <input
                    type="range"
                    className="form-range flex-grow-1"
                    min="0"
                    max="100"
                    value={settings.defaultScore}
                    onChange={(event) =>
                      updateSetting(
                        "defaultScore",
                        Number(event.target.value)
                      )
                    }
                  />

                  <span className="badge bg-dark px-3 py-2">
                    {settings.defaultScore}
                  </span>
                </div>

                <div className="small text-secondary mt-1">
                  Used as the default score threshold for
                  recruitment conditions.
                </div>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="autoSave"
                  checked={settings.autoSave}
                  onChange={(event) =>
                    updateSetting(
                      "autoSave",
                      event.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="autoSave"
                >
                  <span className="fw-semibold">
                    Auto-save workflows
                  </span>

                  <span className="d-block small text-secondary">
                    Automatically save workflow changes
                    locally.
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-1">Notifications</h5>

              <p className="text-secondary small mb-0">
                Choose which events you want to receive.
              </p>
            </div>

            <div className="card-body">
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="emailNotifications"
                  checked={
                    settings.emailNotifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "emailNotifications",
                      event.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="emailNotifications"
                >
                  <span className="fw-semibold">
                    Email notifications
                  </span>

                  <span className="d-block small text-secondary">
                    Receive important workspace updates.
                  </span>
                </label>
              </div>

              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="executionNotifications"
                  checked={
                    settings.executionNotifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "executionNotifications",
                      event.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="executionNotifications"
                >
                  <span className="fw-semibold">
                    Workflow executions
                  </span>

                  <span className="d-block small text-secondary">
                    Get notified when workflow runs finish.
                  </span>
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="candidateNotifications"
                  checked={
                    settings.candidateNotifications
                  }
                  onChange={(event) =>
                    updateSetting(
                      "candidateNotifications",
                      event.target.checked
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="candidateNotifications"
                >
                  <span className="fw-semibold">
                    Candidate updates
                  </span>

                  <span className="d-block small text-secondary">
                    Receive notifications about candidate
                    activity.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* PLAN */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <div className="small text-secondary">
                Current Plan
              </div>

              <h5 className="fw-bold mt-1">
                Development
              </h5>

              <p className="small text-secondary">
                AgentFlow is currently running in frontend
                development mode.
              </p>

              <div className="alert alert-light border small mb-0">
                Backend authentication, database storage
                and production integrations will be added
                in the next phase.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;