const Dashboard = () => {
  const stats = [
    {
      title: "Total Workflows",
      value: "12",
      description: "All created workflows",
    },
    {
      title: "Active Workflows",
      value: "8",
      description: "Currently enabled",
    },
    {
      title: "Total Executions",
      value: "1,248",
      description: "Workflow runs",
    },
    {
      title: "Success Rate",
      value: "94.8%",
      description: "Successful executions",
    },
  ];

  const recentExecutions = [
    {
      workflow: "Resume Screening",
      status: "Completed",
      time: "2 minutes ago",
    },
    {
      workflow: "Candidate Matching",
      status: "Completed",
      time: "15 minutes ago",
    },
    {
      workflow: "Interview Scheduling",
      status: "Running",
      time: "28 minutes ago",
    },
    {
      workflow: "Candidate Evaluation",
      status: "Failed",
      time: "1 hour ago",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Dashboard</h2>
        <p className="text-muted mb-0">
          Monitor your AI recruitment automation workflows.
        </p>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat) => (
          <div className="col-12 col-md-6 col-xl-3" key={stat.title}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <p className="text-muted mb-2">{stat.title}</p>

                <h3 className="fw-bold mb-2">{stat.value}</h3>

                <small className="text-muted">
                  {stat.description}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">Recent Executions</h5>
              <p className="text-muted mb-0">
                Latest workflow activity
              </p>
            </div>

            <button className="btn btn-outline-primary btn-sm">
              View all
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Workflow</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {recentExecutions.map((execution) => (
                  <tr key={`${execution.workflow}-${execution.time}`}>
                    <td className="fw-semibold">
                      {execution.workflow}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          execution.status === "Completed"
                            ? "text-bg-success"
                            : execution.status === "Running"
                              ? "text-bg-warning"
                              : "text-bg-danger"
                        }`}
                      >
                        {execution.status}
                      </span>
                    </td>

                    <td className="text-muted">
                      {execution.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;