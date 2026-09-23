import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


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
      label: "Logout",
      path: "/logout",
      onClick: handleLogout
    }
  ];

  return (
    <aside
      className=" agentflow-sidebar bg-dark text-white d-flex flex-column"
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
              `d-block text-decoration-none rounded px-3 py-2 mb-2 ${isActive
                ? "bg-primary text-white"
                : "text-light"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>


      <div className="p-3 border-top border-secondary">
        <button
          type="button"
          className="btn btn-outline-light w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      
    </aside>
  );
};

export default Sidebar;