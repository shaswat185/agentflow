import { useEffect, useState } from "react";
import {
  createJob,
  deleteJob,
  getJobs,
  updateJob,
  type Job,
  type JobPayload,
} from "../services/jobService";

const emptyForm: JobPayload = {
  title: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  description: "",
  skills: [],
  experience: "",
  status: "open",
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<JobPayload>(emptyForm);

  const [skillsInput, setSkillsInput] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs();

      setJobs(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingJobId(null);
    setForm(emptyForm);
    setSkillsInput("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (job: Job) => {
    setEditingJobId(job._id);

    setForm({
      title: job.title,
      department: job.department || "",
      location: job.location || "",
      employmentType:
        job.employmentType || "Full-time",
      description: job.description,
      skills: job.skills || [],
      experience: job.experience || "",
      status: job.status,
    });

    setSkillsInput(
      (job.skills || []).join(", ")
    );

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJobId(null);
    setForm(emptyForm);
    setSkillsInput("");
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const skills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const payload: JobPayload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        skills,
      };

      if (editingJobId) {
        const updatedJob = await updateJob(
          editingJobId,
          payload
        );

        setJobs((previous) =>
          previous.map((job) =>
            job._id === editingJobId
              ? updatedJob
              : job
          )
        );
      } else {
        const newJob = await createJob(payload);

        setJobs((previous) => [
          newJob,
          ...previous,
        ]);
      }

      closeForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save job"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteJob(id);

      setJobs((previous) =>
        previous.filter((job) => job._id !== id)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete job"
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Jobs</h2>

          <p className="text-muted mb-0">
            Manage job openings and candidate applications.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateForm}
        >
          + Create Job
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="mb-3">
              {editingJobId
                ? "Edit Job"
                : "Create Job"}
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Title */}
                <div className="col-md-6">
                  <label className="form-label">
                    Job Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Frontend Developer"
                    value={form.title}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                {/* Department */}
                <div className="col-md-6">
                  <label className="form-label">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="e.g. Engineering"
                    value={form.department}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                {/* Location */}
                <div className="col-md-6">
                  <label className="form-label">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Remote"
                    value={form.location}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                {/* Employment */}
                <div className="col-md-6">
                  <label className="form-label">
                    Employment Type
                  </label>

                  <select
                    name="employmentType"
                    className="form-select"
                    value={form.employmentType}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Internship">
                      Internship
                    </option>
                  </select>
                </div>

                {/* Experience */}
                <div className="col-md-6">
                  <label className="form-label">
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    className="form-control"
                    placeholder="e.g. 1-3 years"
                    value={form.experience}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={form.status}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="open">
                      Open
                    </option>

                    <option value="closed">
                      Closed
                    </option>
                  </select>
                </div>

                {/* Skills */}
                <div className="col-12">
                  <label className="form-label">
                    Skills
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="React.js, Node.js, MongoDB, TypeScript"
                    value={skillsInput}
                    onChange={(event) =>
                      setSkillsInput(
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />

                  <small className="text-muted">
                    Separate skills with commas.
                  </small>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">
                    Job Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows={5}
                    placeholder="Describe the role and requirements..."
                    value={form.description}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                {/* Buttons */}
                <div className="col-12 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingJobId
                      ? "Update Job"
                      : "Create Job"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="text-muted mt-3 mb-0">
                Loading jobs...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-5">
              <h5>No jobs found</h5>

              <p className="text-muted mb-3">
                Create your first job opening.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={openCreateForm}
              >
                + Create Job
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">
                      Job
                    </th>

                    <th>Department</th>

                    <th>Location</th>

                    <th>Employment</th>

                    <th>Status</th>

                    <th>Created</th>

                    <th className="text-end pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-4">
                        <div className="fw-semibold">
                          {job.title}
                        </div>

                        <small className="text-muted">
                          {job._id}
                        </small>
                      </td>

                      <td>
                        {job.department || "-"}
                      </td>

                      <td>
                        {job.location || "-"}
                      </td>

                      <td>
                        {job.employmentType || "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            job.status === "open"
                              ? "text-bg-success"
                              : "text-bg-secondary"
                          }`}
                        >
                          {job.status === "open"
                            ? "Open"
                            : "Closed"}
                        </span>
                      </td>

                      <td className="text-muted">
                        {job.createdAt
                          ? new Date(
                              job.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              openEditForm(job)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(job._id)
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
      </div>
    </div>
  );
};

export default Jobs;