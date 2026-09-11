import { useState } from "react";

type Integration = {
  name: string;
  description: string;
  category: string;
  icon: string;
  connected: boolean;
};

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: "Gemini AI",
      description: "Power AI agents with Gemini models.",
      category: "AI",
      icon: "✦",
      connected: true,
    },
    {
      name: "Gmail",
      description: "Send automated candidate emails.",
      category: "Communication",
      icon: "✉",
      connected: false,
    },
    {
      name: "Google Calendar",
      description: "Schedule candidate interviews automatically.",
      category: "Calendar",
      icon: "▣",
      connected: false,
    },
    {
      name: "Slack",
      description: "Send recruitment workflow notifications.",
      category: "Communication",
      icon: "◈",
      connected: false,
    },
    {
      name: "Google Drive",
      description: "Store and access candidate documents.",
      category: "Storage",
      icon: "▰",
      connected: false,
    },
    {
      name: "Webhook",
      description: "Connect AgentFlow with external applications.",
      category: "Developer Tools",
      icon: "⌁",
      connected: false,
    },
  ]);

  const toggleConnection = (name: string) => {
    setIntegrations((currentIntegrations) =>
      currentIntegrations.map((integration) =>
        integration.name === name
          ? {
              ...integration,
              connected: !integration.connected,
            }
          : integration
      )
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Integrations</h2>
        <p className="text-muted mb-0">
          Connect the tools and services used by your AI workflows.
        </p>
      </div>

      <div className="row g-4">
        {integrations.map((integration) => (
          <div
            className="col-md-6 col-xl-4"
            key={integration.name}
          >
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "46px",
                      height: "46px",
                      fontSize: "20px",
                    }}
                  >
                    {integration.icon}
                  </div>

                  <span className="badge text-bg-light border">
                    {integration.category}
                  </span>
                </div>

                <h5 className="mt-4 mb-2">
                  {integration.name}
                </h5>

                <p className="text-muted small flex-grow-1">
                  {integration.description}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span
                    className={`small fw-semibold ${
                      integration.connected
                        ? "text-success"
                        : "text-muted"
                    }`}
                  >
                    {integration.connected
                      ? "● Connected"
                      : "○ Not connected"}
                  </span>

                  <button
                    type="button"
                    className={`btn btn-sm ${
                      integration.connected
                        ? "btn-outline-danger"
                        : "btn-primary"
                    }`}
                    onClick={() =>
                      toggleConnection(integration.name)
                    }
                  >
                    {integration.connected
                      ? "Disconnect"
                      : "Connect"}
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

export default Integrations;