import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Workflows",
      path: "/workflows",
    },
    {
      label: "Executions",
      path: "/executions",
    },
    {
      label: "Templates",
      path: "/templates",
    },
    {
      label: "Jobs",
      path: "/jobs",
    },
    {
      label: "Candidates",
      path: "/candidates",
    },
    {
      label: "Integrations",
      path: "/integrations",
    },
    {
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside
      className="bg-dark text-white d-flex flex-column"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <div className="p-4 border-bottom border-secondary">
        <h4 className="mb-0">AgentFlow</h4>
        <small className="text-secondary">
          AI Automation Platform
        </small>
      </div>

      <nav className="p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-block text-decoration-none rounded px-3 py-2 mb-2 ${
                isActive
                  ? "bg-primary text-white"
                  : "text-light"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;