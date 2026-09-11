import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div
        className="card border-0 shadow-sm"
        style={{ width: "100%", maxWidth: "430px" }}
      >
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1">AgentFlow</h3>
            <p className="text-muted mb-0">
              AI Recruitment Automation
            </p>
          </div>

          <h5 className="mb-1">Welcome back</h5>

          <p className="text-muted small mb-4">
            Sign in to your AgentFlow workspace.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted small">
              Don't have an account?{" "}
            </span>

            <Link
              to="/register"
              className="small text-decoration-none"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;