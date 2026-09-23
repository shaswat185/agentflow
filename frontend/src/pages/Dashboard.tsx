import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getWorkflows,
  type WorkflowResponse,
} from "../services/workflowService";

import {
  getJobs,
  type Job,
} from "../services/jobService";

import {
  getCandidates,
  type Candidate,
} from "../services/candidateService";

const Dashboard = () => {
  const [workflows, setWorkflows] = useState<
    WorkflowResponse[]
  >([]);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<
    Candidate[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        workflowData,
        jobData,
        candidateData,
      ] = await Promise.all([
        getWorkflows(),
        getJobs(),
        getCandidates(),
      ]);

      setWorkflows(workflowData);
      setJobs(jobData);
      setCandidates(candidateData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const activeWorkflows = useMemo(
    () =>
      workflows.filter(
        (workflow) =>
          workflow.status === "active"
      ).length,
    [workflows]
  );

  const draftWorkflows = useMemo(
    () =>
      workflows.filter(
        (workflow) =>
          workflow.status === "draft"
      ).length,
    [workflows]
  );

  const shortlistedCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) =>
          candidate.status === "shortlisted"
      ).length,
    [candidates]
  );

  const interviewCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) =>
          candidate.status === "interview"
      ).length,
    [candidates]
  );

  const averageScore = useMemo(() => {
    if (candidates.length === 0) {
      return 0;
    }

    const total = candidates.reduce(
      (sum, candidate) =>
        sum +
        (candidate.screeningScore ?? 0),
      0
    );

    return Math.round(
      total / candidates.length
    );
  }, [candidates]);

  const recentCandidates = candidates.slice(
    0,
    5
  );

  const recentJobs = jobs.slice(0, 5);

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div
          className="spinner-border"
          role="status"
        />

        <p className="text-secondary mt-3 mb-0">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Dashboard
          </h2>

          <p className="text-secondary mb-0">
            Overview of your recruitment
            automation workspace.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link
            to="/workflows/new"
            className="btn btn-dark"
          >
            + New Workflow
          </Link>

          <Link
            to="/candidates"
            className="btn btn-outline-dark"
          >
            View Candidates
          </Link>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* MAIN STATS */}

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-secondary small">
                    Total Workflows
                  </div>

                  <div className="fs-2 fw-bold mt-2">
                    {workflows.length}
                  </div>
                </div>

                <div className="fs-3">
                  ⚡
                </div>
              </div>

              <div className="small text-secondary mt-2">
                {activeWorkflows} active ·{" "}
                {draftWorkflows} drafts
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-secondary small">
                    Open Jobs
                  </div>

                  <div className="fs-2 fw-bold mt-2">
                    {
                      jobs.filter(
                        (job) =>
                          job.status === "open"
                      ).length
                    }
                  </div>
                </div>

                <div className="fs-3">
                  💼
                </div>
              </div>

              <div className="small text-secondary mt-2">
                {jobs.length} total jobs
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-secondary small">
                    Candidates
                  </div>

                  <div className="fs-2 fw-bold mt-2">
                    {candidates.length}
                  </div>
                </div>

                <div className="fs-3">
                  👥
                </div>
              </div>

              <div className="small text-secondary mt-2">
                {shortlistedCandidates} shortlisted
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-secondary small">
                    Average AI Score
                  </div>

                  <div className="fs-2 fw-bold mt-2">
                    {averageScore}
                    <span className="fs-6 text-secondary">
                      /100
                    </span>
                  </div>
                </div>

                <div className="fs-3">
                  🤖
                </div>
              </div>

              <div className="small text-secondary mt-2">
                Based on screened candidates
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY STATS */}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-secondary small">
                Shortlisted Candidates
              </div>

              <div className="fs-4 fw-bold text-success mt-1">
                {shortlistedCandidates}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-secondary small">
                Interview Candidates
              </div>

              <div className="fs-4 fw-bold text-primary mt-1">
                {interviewCandidates}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-secondary small">
                Recruitment Pipeline
              </div>

              <div className="fs-4 fw-bold mt-1">
                {candidates.length > 0
                  ? "Active"
                  : "Waiting"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT CANDIDATES + JOBS */}

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-1">
                  Recent Candidates
                </h5>

                <div className="small text-secondary">
                  Latest candidates in your pipeline
                </div>
              </div>

              <Link
                to="/candidates"
                className="btn btn-sm btn-outline-dark"
              >
                View all
              </Link>
            </div>

            {recentCandidates.length ===
            0 ? (
              <div className="card-body text-center py-5">
                <div className="fs-1">
                  👤
                </div>

                <h6 className="mt-2">
                  No candidates yet
                </h6>

                <p className="text-secondary small">
                  Add your first candidate to
                  start the recruitment pipeline.
                </p>

                <Link
                  to="/candidates"
                  className="btn btn-sm btn-dark"
                >
                  Add Candidate
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">
                        Candidate
                      </th>
                      <th>Job</th>
                      <th>Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentCandidates.map(
                      (candidate) => (
                        <tr
                          key={
                            candidate._id
                          }
                        >
                          <td className="ps-3">
                            <div className="fw-semibold">
                              {
                                candidate.name
                              }
                            </div>

                            <div className="small text-secondary">
                              {
                                candidate.email
                              }
                            </div>
                          </td>

                          <td>
                            {candidate.jobId
                              ?.title ||
                              "No job"}
                          </td>

                          <td>
                            <span className="fw-semibold">
                              {
                                candidate.screeningScore ??
                                0
                              }
                            </span>
                            /100
                          </td>

                          <td>
                            <span className="badge bg-light text-dark">
                              {
                                candidate.status
                              }
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-1">
                  Recent Jobs
                </h5>

                <div className="small text-secondary">
                  Your latest job openings
                </div>
              </div>

              <Link
                to="/jobs"
                className="btn btn-sm btn-outline-dark"
              >
                View all
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="card-body text-center py-5">
                <div className="fs-1">
                  💼
                </div>

                <h6 className="mt-2">
                  No jobs yet
                </h6>

                <Link
                  to="/jobs"
                  className="btn btn-sm btn-dark"
                >
                  Create Job
                </Link>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="list-group-item px-3 py-3"
                  >
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <div className="fw-semibold">
                          {job.title}
                        </div>

                        <div className="small text-secondary mt-1">
                          {job.department ||
                            "General"}{" "}
                          ·{" "}
                          {job.location ||
                            "Remote"}
                        </div>
                      </div>

                      <span
                        className={`badge align-self-start ${
                          job.status ===
                          "open"
                            ? "bg-success-subtle text-success"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WORKFLOW OVERVIEW */}

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <div>
            <h5 className="mb-1">
              Workflow Overview
            </h5>

            <div className="small text-secondary">
              Recruitment automation workflows
            </div>
          </div>

          <Link
            to="/workflows"
            className="btn btn-sm btn-outline-dark"
          >
            Manage Workflows
          </Link>
        </div>

        {workflows.length === 0 ? (
          <div className="card-body text-center py-5">
            <div className="fs-1">
              ⚡
            </div>

            <h6 className="mt-2">
              No workflows created
            </h6>

            <p className="text-secondary small">
              Build your first AI recruitment
              workflow.
            </p>

            <Link
              to="/workflows/new"
              className="btn btn-dark"
            >
              Create Workflow
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">
                    Workflow
                  </th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                {workflows
                  .slice(0, 5)
                  .map((workflow) => (
                    <tr
                      key={workflow._id}
                    >
                      <td className="ps-3">
                        <div className="fw-semibold">
                          {workflow.name}
                        </div>

                        <div className="small text-secondary">
                          {workflow.description ||
                            "Recruitment automation workflow"}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            workflow.status ===
                            "active"
                              ? "bg-success-subtle text-success"
                              : "bg-secondary-subtle text-secondary"
                          }`}
                        >
                          {
                            workflow.status
                          }
                        </span>
                      </td>

                      <td className="text-secondary">
                        {workflow.updatedAt
                          ? new Date(
                              workflow.updatedAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;