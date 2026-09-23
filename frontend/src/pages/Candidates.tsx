import { useEffect, useMemo, useState } from "react";

import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  type Candidate as ApiCandidate,
  type CandidateStatus,
} from "../services/candidateService";

import {
  getJobs,
  type Job,
} from "../services/jobService";

type DisplayStatus =
  | "New"
  | "Screening"
  | "Shortlisted"
  | "Interview"
  | "Rejected";

type Candidate = ApiCandidate & {
  displayStatus: DisplayStatus;
};

const Candidates = () => {
  const [candidates, setCandidates] = useState<
    ApiCandidate[]
  >([]);

  const [jobs, setJobs] = useState<Job[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingCandidate, setEditingCandidate] =
    useState<ApiCandidate | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobId: "",
    score: 70,
    status: "new" as CandidateStatus,
    experience: "",
    skills: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [candidateData, jobData] =
        await Promise.all([
          getCandidates(),
          getJobs(),
        ]);

      setCandidates(candidateData);
      setJobs(jobData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDisplayStatus = (
    status: CandidateStatus
  ): DisplayStatus => {
    switch (status) {
      case "screening":
        return "Screening";

      case "shortlisted":
        return "Shortlisted";

      case "interview":
        return "Interview";

      case "rejected":
        return "Rejected";

      case "pending":
      case "new":
      default:
        return "New";
    }
  };

  const getJobTitle = (
    candidate: ApiCandidate
  ) => {
    return candidate.jobId?.title || "No job assigned";
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchValue =
        search.toLowerCase().trim();

      const jobTitle =
        getJobTitle(candidate).toLowerCase();

      const skills =
        (candidate.skills || [])
          .join(", ")
          .toLowerCase();

      const matchesSearch =
        !searchValue ||
        candidate.name
          .toLowerCase()
          .includes(searchValue) ||
        candidate.email
          .toLowerCase()
          .includes(searchValue) ||
        jobTitle.includes(searchValue) ||
        skills.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        getDisplayStatus(candidate.status) ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
  ]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      jobId: "",
      score: 70,
      status: "new",
      experience: "",
      skills: "",
    });

    setEditingCandidate(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (
    candidate: ApiCandidate
  ) => {
    setEditingCandidate(candidate);

    setForm({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || "",
      jobId: candidate.jobId?._id || "",
      score:
        candidate.screeningScore ?? 70,
      status:
        candidate.status === "pending"
          ? "new"
          : candidate.status,
      experience:
        candidate.experience || "",
      skills:
        (candidate.skills || []).join(", "),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleFormChange = (
    field: keyof typeof form,
    value: string | number
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveCandidate =
    async () => {
      if (
        !form.name.trim() ||
        !form.email.trim()
      ) {
        setError(
          "Name and email are required."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");

        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          jobId: form.jobId || undefined,
          experience:
            form.experience.trim(),
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          screeningScore: form.score,
          status: form.status,
        };

        if (editingCandidate) {
          const updated =
            await updateCandidate(
              editingCandidate._id,
              payload
            );

          setCandidates((current) =>
            current.map((candidate) =>
              candidate._id ===
              editingCandidate._id
                ? updated
                : candidate
            )
          );
        } else {
          const created =
            await createCandidate(payload);

          setCandidates((current) => [
            created,
            ...current,
          ]);
        }

        closeModal();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to save candidate"
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteCandidate =
    async (
      candidate: ApiCandidate
    ) => {
      const confirmed =
        window.confirm(
          `Delete candidate "${candidate.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await deleteCandidate(
          candidate._id
        );

        setCandidates((current) =>
          current.filter(
            (item) =>
              item._id !== candidate._id
          )
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to delete candidate"
        );
      }
    };

  const getStatusClass = (
    status: DisplayStatus
  ) => {
    switch (status) {
      case "Shortlisted":
        return "bg-success-subtle text-success";

      case "Interview":
        return "bg-primary-subtle text-primary";

      case "Rejected":
        return "bg-danger-subtle text-danger";

      case "Screening":
        return "bg-warning-subtle text-warning-emphasis";

      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  const getScoreClass = (
    score: number
  ) => {
    if (score >= 80) {
      return "text-success";
    }

    if (score >= 60) {
      return "text-warning";
    }

    return "text-danger";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Candidates
          </h2>

          <p className="text-secondary mb-0">
            Manage candidates and track
            their recruitment progress.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-dark"
          onClick={openAddModal}
        >
          + Add Candidate
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Total Candidates
              </div>

              <div className="fs-3 fw-bold mt-1">
                {candidates.length}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Shortlisted
              </div>

              <div className="fs-3 fw-bold mt-1 text-success">
                {
                  candidates.filter(
                    (candidate) =>
                      candidate.status ===
                      "shortlisted"
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Interviews
              </div>

              <div className="fs-3 fw-bold mt-1 text-primary">
                {
                  candidates.filter(
                    (candidate) =>
                      candidate.status ===
                      "interview"
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Average Score
              </div>

              <div className="fs-3 fw-bold mt-1">
                {candidates.length > 0
                  ? Math.round(
                      candidates.reduce(
                        (
                          total,
                          candidate
                        ) =>
                          total +
                          (candidate.screeningScore ??
                            0),
                        0
                      ) /
                        candidates.length
                    )
                  : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search candidates, email, job or skills..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="col-12 col-lg-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Statuses
                </option>
                <option value="New">
                  New
                </option>
                <option value="Screening">
                  Screening
                </option>
                <option value="Shortlisted">
                  Shortlisted
                </option>
                <option value="Interview">
                  Interview
                </option>
                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* CANDIDATES */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-1">
            Candidate Pipeline
          </h5>

          <div className="small text-secondary">
            {filteredCandidates.length} candidate
            {filteredCandidates.length !== 1
              ? "s"
              : ""}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              role="status"
            />
            <p className="text-secondary mt-3">
              Loading candidates...
            </p>
          </div>
        ) : filteredCandidates.length ===
          0 ? (
          <div className="text-center py-5 px-3">
            <div className="fs-1 mb-2">
              👤
            </div>

            <h5>No candidates found</h5>

            <p className="text-secondary mb-3">
              Try changing your search or
              add a new candidate.
            </p>

            <button
              type="button"
              className="btn btn-dark"
              onClick={openAddModal}
            >
              + Add Candidate
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">
                    Candidate
                  </th>
                  <th>Job</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Experience</th>
                  <th>Added</th>
                  <th className="text-end pe-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map(
                  (candidate) => {
                    const displayStatus =
                      getDisplayStatus(
                        candidate.status
                      );

                    return (
                      <tr
                        key={
                          candidate._id
                        }
                      >
                        <td className="ps-4">
                          <div className="fw-semibold">
                            {candidate.name}
                          </div>

                          <div className="small text-secondary">
                            {candidate.email}
                          </div>
                        </td>

                        <td>
                          <div className="fw-medium">
                            {getJobTitle(
                              candidate
                            )}
                          </div>

                          <div className="small text-secondary">
                            {(
                              candidate.skills ||
                              []
                            ).join(", ")}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`fw-bold ${getScoreClass(
                              candidate.screeningScore ??
                                0
                            )}`}
                          >
                            {candidate.screeningScore ??
                              0}
                          </span>

                          <span className="text-secondary">
                            /100
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${getStatusClass(
                              displayStatus
                            )}`}
                          >
                            {displayStatus}
                          </span>
                        </td>

                        <td>
                          {candidate.experience ||
                            "—"}
                        </td>

                        <td className="text-secondary">
                          {candidate.createdAt
                            ? new Date(
                                candidate.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                openEditModal(
                                  candidate
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteCandidate(
                                  candidate
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title">
                    {editingCandidate
                      ? "Edit Candidate"
                      : "Add Candidate"}
                  </h5>

                  <div className="small text-secondary">
                    Add candidate information
                    to the pipeline.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(event) =>
                        handleFormChange(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Candidate name"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(event) =>
                        handleFormChange(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="candidate@example.com"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Phone
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={form.phone}
                      onChange={(event) =>
                        handleFormChange(
                          "phone",
                          event.target.value
                        )
                      }
                      placeholder="+91..."
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Job
                    </label>

                    <select
                      className="form-select"
                      value={form.jobId}
                      onChange={(event) =>
                        handleFormChange(
                          "jobId",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Select a job
                      </option>

                      {jobs.map((job) => (
                        <option
                          key={job._id}
                          value={job._id}
                        >
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">
                      Score
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-control"
                      value={form.score}
                      onChange={(event) =>
                        handleFormChange(
                          "score",
                          Math.min(
                            100,
                            Math.max(
                              0,
                              Number(
                                event.target
                                  .value
                              )
                            )
                          )
                        )
                      }
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">
                      Status
                    </label>

                    <select
                      className="form-select"
                      value={form.status}
                      onChange={(event) =>
                        handleFormChange(
                          "status",
                          event.target
                            .value as CandidateStatus
                        )
                      }
                    >
                      <option value="new">
                        New
                      </option>

                      <option value="screening">
                        Screening
                      </option>

                      <option value="shortlisted">
                        Shortlisted
                      </option>

                      <option value="interview">
                        Interview
                      </option>

                      <option value="rejected">
                        Rejected
                      </option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">
                      Experience
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        form.experience
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "experience",
                          event.target.value
                        )
                      }
                      placeholder="3 years"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Skills
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={form.skills}
                      onChange={(event) =>
                        handleFormChange(
                          "skills",
                          event.target.value
                        )
                      }
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={
                    handleSaveCandidate
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCandidate
                    ? "Save Changes"
                    : "Add Candidate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;