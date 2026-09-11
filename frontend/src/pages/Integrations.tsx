import { useEffect, useState } from "react";

type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  connected: boolean;
};

const STORAGE_KEY = "agentflow-integrations";

const initialIntegrations: Integration[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description:
      "Power AI agents with Gemini models for resume analysis and candidate evaluation.",
    category: "AI",
    icon: "✦",
    connected: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Send automated candidate emails and recruitment notifications.",
    category: "Communication",
    icon: "✉",
    connected: false,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description:
      "Schedule interviews and send calendar invitations automatically.",
    category: "Calendar",
    icon: "▣",
    connected: false,
  },
  {
    id: "webhook",
    name: "Webhooks",
    description:
      "Connect AgentFlow workflows with external applications and services.",
    category: "Developer",
    icon: "↗",
    connected: false,
  },
];

const Integrations = () => {
  const [integrations, setIntegrations] =
    useState<Integration[]>(initialIntegrations);

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedIntegrations =
      localStorage.getItem(STORAGE_KEY);

    if (!savedIntegrations) return;

    try {
      const parsed = JSON.parse(savedIntegrations);

      if (Array.isArray(parsed)) {
        setIntegrations(parsed);
      }
    } catch (error) {
      console.error(
        "Failed to load integrations:",
        error
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(integrations)
    );
  }, [integrations]);

  const categories = Array.from(
    new Set(
      integrations.map(
        (integration) => integration.category
      )
    )
  );

  const filteredIntegrations =
    categoryFilter === "All"
      ? integrations
      : integrations.filter(
          (integration) =>
            integration.category === categoryFilter
        );

  const connectedCount = integrations.filter(
    (integration) => integration.connected
  ).length;

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey("");
  };

  const handleSaveConnection = () => {
    if (!selectedIntegration) return;

    if (
      selectedIntegration.id === "webhook" &&
      !apiKey.trim()
    ) {
      window.alert("Please enter the webhook URL.");
      return;
    }

    if (
      selectedIntegration.id !== "webhook" &&
      !apiKey.trim()
    ) {
      window.alert(
        "Please enter the API key to connect this integration."
      );
      return;
    }

    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === selectedIntegration.id
          ? {
              ...integration,
              connected: true,
            }
          : integration
      )
    );

    setSelectedIntegration(null);
    setApiKey("");

    window.alert(
      `${selectedIntegration.name} connected successfully.`
    );
  };

  const handleDisconnect = (
    integration: Integration
  ) => {
    const confirmed = window.confirm(
      `Disconnect ${integration.name}?`
    );

    if (!confirmed) return;

    setIntegrations((current) =>
      current.map((item) =>
        item.id === integration.id
          ? {
              ...item,
              connected: false,
            }
          : item
      )
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Integrations
          </h2>

          <p className="text-secondary mb-0">
            Connect AgentFlow with the tools your
            recruitment workflows use.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Available Integrations
              </div>

              <div className="fs-3 fw-bold mt-1">
                {integrations.length}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Connected
              </div>

              <div className="fs-3 fw-bold mt-1 text-success">
                {connectedCount}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="small text-secondary">
                Connection Status
              </div>

              <div className="mt-2">
                <span className="badge bg-success-subtle text-success">
                  {connectedCount > 0
                    ? "Partially Connected"
                    : "Not Connected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${
                categoryFilter === "All"
                  ? "btn-dark"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCategoryFilter("All")}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`btn ${
                  categoryFilter === category
                    ? "btn-dark"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setCategoryFilter(category)
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTEGRATIONS */}
      <div className="row g-4">
        {filteredIntegrations.map((integration) => (
          <div
            className="col-12 col-md-6"
            key={integration.id}
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      fontSize: 24,
                    }}
                  >
                    {integration.icon}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {integration.name}
                        </h5>

                        <span className="badge bg-secondary-subtle text-secondary">
                          {integration.category}
                        </span>
                      </div>

                      {integration.connected && (
                        <span className="badge bg-success-subtle text-success">
                          ● Connected
                        </span>
                      )}
                    </div>

                    <p className="text-secondary small mt-3 mb-4">
                      {integration.description}
                    </p>

                    <div className="d-flex justify-content-end">
                      {integration.connected ? (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleDisconnect(
                              integration
                            )
                          }
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={() =>
                            handleConnect(integration)
                          }
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONNECTION MODAL */}
      {selectedIntegration && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">
                    Connect{" "}
                    {selectedIntegration.name}
                  </h5>

                  <div className="small text-secondary">
                    Configure this integration for
                    AgentFlow.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setSelectedIntegration(null)
                  }
                />
              </div>

              <div className="modal-body">
                <label className="form-label fw-semibold">
                  {selectedIntegration.id === "webhook"
                    ? "Webhook URL"
                    : "API Key"}
                </label>

                <input
                  type={
                    selectedIntegration.id === "webhook"
                      ? "url"
                      : "password"
                  }
                  className="form-control"
                  placeholder={
                    selectedIntegration.id ===
                    "webhook"
                      ? "https://example.com/webhook"
                      : "Enter API key"
                  }
                  value={apiKey}
                  onChange={(event) =>
                    setApiKey(event.target.value)
                  }
                />

                <div className="small text-secondary mt-2">
                  This is a frontend demo configuration.
                  Real credentials will be securely handled
                  by the backend later.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    setSelectedIntegration(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleSaveConnection}
                >
                  Connect Integration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;