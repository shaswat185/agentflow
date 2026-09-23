import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  setError("");

  if (!email || !password) {
    setError("Email and password are required.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    const token = data.data?.token;

    if (!token) {
      throw new Error("Token was not received from server.");
    }

    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      })
    );


    navigate("/dashboard");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong during login.";

    setError(message);
  } finally {
    setLoading(false);
  }
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

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
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