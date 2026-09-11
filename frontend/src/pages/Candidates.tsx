import { useEffect, useMemo, useState } from "react";

type CandidateStatus =
  | "New"
  | "Screening"
  | "Shortlisted"
  | "Interview"
  | "Rejected";

type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  job: string;
  score: number;
  status: CandidateStatus;
  experience: string;
  skills: string;
  createdAt: string;
};

const STORAGE_KEY = "agentflow-candidates";

const initialCandidates: Candidate[] = [
  {
    id: "candidate-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    job: "Senior React Developer",
    score: 92,
    status: "Shortlisted",
    experience: "4 years",
    skills: "React, TypeScript, Node.js",
    createdAt: "Today",
  },
  {
    id: "candidate-2",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+91 98765 12345",
    job: "Full-Stack Developer",
    score: 84,
    status: "Interview",
    experience: "3 years",
    skills: "React, Node.js, MongoDB",
    createdAt: "Yesterday",
  },
  {
    id: "candidate-3",
    name: "Aman Verma",
    email: "aman.verma@example.com",
    phone: "+91 99887 66554",
    job: "Frontend Developer",
    score: 68,
    status: "Screening",
    experience: "2 years",
    skills: "JavaScript, React, Bootstrap",
    createdAt: "2 days ago",
  },
];

const Candidates = () => {
  const [candidates, setCandidates] =
    useState<Candidate[]>(initialCandidates);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] =
    useState<Candidate | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    job: "",
    score: 70,
    status: "New" as CandidateStatus,
    experience: "",
    skills: "",
  });

  useEffect(() => {
    const savedCandidates = localStorage.getItem(STORAGE_KEY);

    if (!savedCandidates) return;

    try {
      const parsed = JSON.parse(savedCandidates);

      if (Array.isArray(parsed)) {
        setCandidates(parsed);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        candidate.name.toLowerCase().includes(searchValue) ||
        candidate.email.toLowerCase().includes(searchValue) ||
        candidate.job.toLowerCase().includes(searchValue) ||
        candidate.skills.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        candidate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      job: "",
      score: 70,
      status: "New",
      experience: "",
      skills: "",
    });

    setEditingCandidate(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);

    setForm({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      job: candidate.job,
      score: candidate.score,
      status: candidate.status,
      experience: candidate.experience,
      skills: candidate.skills,
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

  const handleSaveCandidate = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.job.trim()
    ) {
      window.alert("Name, email and job are required.");
      return;
    }

    if (editingCandidate) {
      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === editingCandidate.id
            ? {
                ...candidate,
                ...form,
              }
            : candidate
        )
      );
    } else {
      const newCandidate: Candidate = {
        id: `candidate-${Date.now()}`,
        ...form,
        createdAt: "Just now",
      };

      setCandidates((current) => [newCandidate, ...current]);
    }

    closeModal();
  };

  const handleDeleteCandidate = (candidate: Candidate) => {
    const confirmed = window.confirm(
      `Delete candidate "${candidate.name}"?`
    );

    if (!confirmed) return;

    setCandidates((current) =>
      current.filter((item) => item.id !== candidate.id)
    );
  };

  const getStatusClass = (status: CandidateStatus) => {
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

  const getScoreClass = (score: number) => {
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
          <h2 className="fw-bold mb-1">Candidates</h2>

          <p className="text-secondary mb-0">
            Manage candidates and track their recruitment progress.
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
                      candidate.status === "Shortlisted"
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
                      candidate.status === "Interview"
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
                        (total, candidate) =>
                          total + candidate.score,
                        0
                      ) / candidates.length
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
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-lg-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Screening">Screening</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* CANDIDATES */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Candidate Pipeline</h5>

              <div className="small text-secondary">
                {filteredCandidates.length} candidate
                {filteredCandidates.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div className="fs-1 mb-2">👤</div>

            <h5>No candidates found</h5>

            <p className="text-secondary mb-3">
              Try changing your search or add a new candidate.
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
                  <th className="ps-4">Candidate</th>
                  <th>Job</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Experience</th>
                  <th>Added</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
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
                        {candidate.job}
                      </div>

                      <div className="small text-secondary">
                        {candidate.skills}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`fw-bold ${getScoreClass(
                          candidate.score
                        )}`}
                      >
                        {candidate.score}
                      </span>
                        <span className="text-secondary">
                          /100
                        </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusClass(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                    </td>

                    <td>{candidate.experience || "—"}</td>

                    <td className="text-secondary">
                      {candidate.createdAt}
                    </td>

                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            openEditModal(candidate)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDeleteCandidate(candidate)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                    Add candidate information to the pipeline.
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

                    <input
                      type="text"
                      className="form-control"
                      value={form.job}
                      onChange={(event) =>
                        handleFormChange(
                          "job",
                          event.target.value
                        )
                      }
                      placeholder="Frontend Developer"
                    />
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
                              Number(event.target.value)
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
                      <option value="New">New</option>
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

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">
                      Experience
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={form.experience}
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
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleSaveCandidate}
                >
                  {editingCandidate
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