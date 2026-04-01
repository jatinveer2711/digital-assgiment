import React, { useEffect, useState } from 'react'
import API from './api/axios';
import { useNavigate } from 'react-router-dom';

export default function Teacher() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState({
        title: "",
        description: "",
        subject: "",
        maxMarks: 0,
        deadLine: "",
        targetSemester: 0
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fetchData, setFetchData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Update modal state
    const [updateModal, setUpdateModal] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [updateData, setUpdateData] = useState({
        title: "",
        description: "",
        subject: "",
        maxMarks: 0,
        deadLine: "",
        targetSemester: 0
    });

    // Submissions modal state
    const [submissionsModal, setSubmissionsModal] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [submissionsError, setSubmissionsError] = useState("");
    const [activeAssignment, setActiveAssignment] = useState(null);

    // ✅ Grading state
    const [gradingId, setGradingId] = useState(null);
    const [gradeInput, setGradeInput] = useState({ marks: "", remarks: "" });
    const [gradingLoading, setGradingLoading] = useState(false);
    const [gradeError, setGradeError] = useState("");

    const handleChange = (e) => {
        setAssignments({ ...assignments, [e.target.name]: e.target.value });
    };

    const handleUpdateChange = (e) => {
        setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleLougout = () => {
        localStorage.removeItem("token");
        let confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            navigate("/login")
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await API.get("assignments/fetchAssigment", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFetchData(res.data.assigments);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const res = await API.post("assignments/createAssigment", assignments, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 201) {
                showSuccess("Assignment created successfully!");
                fetchAssignments();
            }
            setAssignments({ title: "", description: "", subject: "", maxMarks: 0, deadLine: "", targetSemester: 0 });
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openUpdateModal = (item) => {
        setUpdateId(item._id);
        setUpdateData({
            title: item.title,
            description: item.description,
            subject: item.subject,
            maxMarks: item.maxMarks,
            deadLine: item.deadLine?.split("T")[0] || "",
            targetSemester: item.targetSemester
        });
        setUpdateModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await API.put(`assignments/updateAssigment/${updateId}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showSuccess("Assignment updated successfully!");
            setUpdateModal(false);
            fetchAssignments();
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const deleteAssignment = async (id) => {
        try {
            await API.delete(`assignments/deleteAssigment/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showSuccess("Assignment deleted.");
            setDeleteConfirm(null);
            fetchAssignments();
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const openSubmissionsModal = async (item) => {
        setActiveAssignment(item);
        setSubmissions([]);
        setSubmissionsError("");
        setSubmissionsLoading(true);
        setSubmissionsModal(true);
        // Reset grading state when opening modal
        setGradingId(null);
        setGradeInput({ marks: "", remarks: "" });
        setGradeError("");
        try {
            const res = await API.get(`sumbission/fetch/${item._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(res.data.sumbissions || res.data || []);
        } catch (err) {
            setSubmissionsError(err.response?.data?.message || "Failed to fetch submissions");
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const closeSubmissionsModal = () => {
        setSubmissionsModal(false);
        setActiveAssignment(null);
        setSubmissions([]);
        setSubmissionsError("");
        setGradingId(null);
        setGradeInput({ marks: "", remarks: "" });
        setGradeError("");
    };

    // ✅ Open inline grade panel for a submission
    const openGrading = (sub) => {
        setGradeError("");
        setGradingId(sub._id);
        setGradeInput({
            marks: sub.marks != null ? String(sub.marks) : "",
            remarks: sub.remarks || ""
        });
    };

    const cancelGrading = () => {
        setGradingId(null);
        setGradeInput({ marks: "", remarks: "" });
        setGradeError("");
    };

    // ✅ Submit grade
    const handleGrade = async (submissionId) => {
        setGradeError("");

        // Validate marks
        const marksVal = Number(gradeInput.marks);
        if (gradeInput.marks === "" || isNaN(marksVal)) {
            setGradeError("Please enter valid marks.");
            return;
        }
        if (marksVal < 0 || marksVal > (activeAssignment?.maxMarks ?? Infinity)) {
            setGradeError(`Marks must be between 0 and ${activeAssignment?.maxMarks}.`);
            return;
        }

        setGradingLoading(true);
        try {
            await API.put(
                `sumbission/update/${submissionId}`,
                { marks: marksVal, remarks: gradeInput.remarks },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Optimistically update local submissions list
            setSubmissions(prev =>
                prev.map(s =>
                    s._id === submissionId
                        ? { ...s, marks: marksVal, remarks: gradeInput.remarks }
                        : s
                )
            );

            setGradingId(null);
            setGradeInput({ marks: "", remarks: "" });
            showSuccess("Grade saved successfully!");
        } catch (err) {
            setGradeError(err.response?.data?.message || "Failed to save grade.");
        } finally {
            setGradingLoading(false);
        }
    };

    const getDeadlineStatus = (deadline) => {
        if (!deadline) return null;
        const today = new Date();
        const due = new Date(deadline);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { label: "Overdue", color: "text-red-400 bg-red-400/10 border-red-400/20" };
        if (diff <= 3) return { label: `${diff}d left`, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
        return { label: `${diff}d left`, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
    };

    const inputClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200";
    const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Google Font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
            
            /* Smooth inline grade panel animation */
            .grade-panel {
                animation: slideDown 0.2s ease-out;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-6px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            `}</style>

            {/* Top Nav */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 leading-none">Assignment Portal</p>
                            <h1 className="text-sm font-semibold text-slate-100 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                Teacher Dashboard
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href='teacher' className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-full">
                            {fetchData.length} Assignment{fetchData.length !== 1 ? "s" : ""}
                        </a>
                        <a href='/' className="text-zinc-400 hover:text-amber-400 transition">
                            Home
                        </a>

                        <button
                            onClick={handleLougout}
                            className="flex items-center gap-2 text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V7" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Alerts */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                        <button onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-400">✕</button>
                    </div>
                )}
                {success && (
                    <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* CREATE FORM */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800">
                                    <h2 className="font-semibold text-slate-100" style={{ fontFamily: "'DM Serif Display', serif" }}>New Assignment</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Fill in the details below to create</p>
                                </div>
                                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                                    <div>
                                        <label className={labelClass}>Title</label>
                                        <input type="text" name="title" placeholder="e.g. Data Structures Lab" value={assignments.title} onChange={handleChange} className={inputClass} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Description</label>
                                        <textarea name="description" placeholder="Brief description of the assignment..." value={assignments.description} onChange={handleChange} rows={3}
                                            className="w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 resize-none" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Subject</label>
                                        <input type="text" name="subject" placeholder="e.g. Computer Science" value={assignments.subject} onChange={handleChange} className={inputClass} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Max Marks</label>
                                            <input type="number" name="maxMarks" placeholder="100" value={assignments.maxMarks} onChange={handleChange} className={inputClass} min={0} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Semester</label>
                                            <input type="number" name="targetSemester" placeholder="1–8" value={assignments.targetSemester} onChange={handleChange} className={inputClass} min={1} max={8} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Deadline</label>
                                        <input type="date" name="deadLine" value={assignments.deadLine} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2">
                                        {isSubmitting ? (
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        )}
                                        {isSubmitting ? "Creating..." : "Create Assignment"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* ASSIGNMENT LIST */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-slate-100" style={{ fontFamily: "'DM Serif Display', serif" }}>All Assignments</h2>
                            <button onClick={fetchAssignments} className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {fetchData.length === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-16 text-center">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 text-sm font-medium">No assignments yet</p>
                                <p className="text-slate-600 text-xs mt-1">Create your first one using the form</p>
                            </div>
                        ) : (
                            fetchData.map((item) => {
                                const status = getDeadlineStatus(item.deadLine);
                                return (
                                    <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="font-semibold text-slate-100 text-base truncate">{item.title}</h3>
                                                    {status && (
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{item.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        {item.subject}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        {item.maxMarks} marks
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        Sem {item.targetSemester}
                                                    </span>
                                                    {item.deadLine && (
                                                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(item.deadLine).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2 flex-shrink-0">
                                                {/* View Submissions */}
                                                <button
                                                    onClick={() => openSubmissionsModal(item)}
                                                    className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Submissions
                                                </button>

                                                {/* Edit */}
                                                <button onClick={() => openUpdateModal(item)}
                                                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>

                                                {/* Delete */}
                                                {deleteConfirm === item._id ? (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => deleteAssignment(item._id)}
                                                            className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1.5 rounded-lg transition-all">
                                                            Confirm
                                                        </button>
                                                        <button onClick={() => setDeleteConfirm(null)}
                                                            className="text-xs bg-slate-800 text-slate-400 px-2 py-1.5 rounded-lg transition-all">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setDeleteConfirm(item._id)}
                                                        className="text-xs bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>

            {/* ✅ SUBMISSIONS MODAL with inline grading */}
            {submissionsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeSubmissionsModal} />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="font-semibold text-slate-100" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                    Submissions
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                                    {activeAssignment?.title} · {activeAssignment?.subject}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!submissionsLoading && !submissionsError && (
                                    <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full">
                                        {submissions.length} submitted
                                    </span>
                                )}
                                <button onClick={closeSubmissionsModal} className="text-slate-500 hover:text-slate-300 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 px-6 py-5">

                            {/* Loading */}
                            {submissionsLoading && (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <svg className="animate-spin w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <p className="text-slate-500 text-sm">Fetching submissions...</p>
                                </div>
                            )}

                            {/* Error */}
                            {submissionsError && !submissionsLoading && (
                                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {submissionsError}
                                </div>
                            )}

                            {/* Empty */}
                            {!submissionsLoading && !submissionsError && submissions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">No submissions yet</p>
                                    <p className="text-slate-600 text-xs">Students haven't submitted this assignment</p>
                                </div>
                            )}

                            {/* Submissions List */}
                            {!submissionsLoading && !submissionsError && submissions.length > 0 && (
                                <div className="space-y-3">
                                    {submissions.map((sub, index) => (
                                        <div
                                            key={sub._id || index}
                                            className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition-all duration-200"
                                        >
                                            {/* ── Submission Row ── */}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {/* Avatar */}
                                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-amber-400 text-xs font-semibold">
                                                                {(sub.studentId?.name || sub.studentName || "S").charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <div className="min-w-0">
                                                            {/* Student Name */}
                                                            <p className="text-slate-100 text-sm font-medium truncate">
                                                                {sub.studentId?.name || sub.student?.email || "Unknown Student"}
                                                            </p>
                                                            {/* Submitted At */}
                                                            {sub.submittedAt && (
                                                                <p className="text-slate-500 text-xs mt-0.5">
                                                                    {new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                                        hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {/* Marks Badge */}
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${sub.marks != null
                                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                                : "bg-slate-700/50 border-slate-600 text-slate-500"
                                                            }`}>
                                                            {sub.marks != null
                                                                ? `${sub.marks} / ${activeAssignment?.maxMarks}`
                                                                : "Not graded"}
                                                        </span>

                                                        {/* File Link */}
                                                        {sub.fileUrl && (
                                                            <a
                                                                href={sub.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                File
                                                            </a>
                                                        )}

                                                        {/* ✅ Grade / Edit Grade button */}
                                                        {gradingId === sub._id ? (
                                                            // Cancel button when panel is open
                                                            <button
                                                                onClick={cancelGrading}
                                                                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => openGrading(sub)}
                                                                className="text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 hover:border-violet-500/40 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                {sub.marks != null ? "Edit Grade" : "Grade"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Remarks display (when not grading) */}
                                                {sub.remarks && gradingId !== sub._id && (
                                                    <p className="mt-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/40">
                                                        💬 {sub.remarks}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ✅ Inline Grade Panel — slides in below the row */}
                                            {gradingId === sub._id && (
                                                <div className="grade-panel border-t border-slate-700/60 bg-slate-900/70 px-4 py-4">
                                                    {/* Grade error */}
                                                    {gradeError && (
                                                        <div className="mb-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs">
                                                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {gradeError}
                                                        </div>
                                                    )}

                                                    <div className="flex items-end gap-3">
                                                        {/* Marks input */}
                                                        <div className="w-28 flex-shrink-0">
                                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                                                Marks
                                                                <span className="ml-1 text-slate-600 normal-case font-normal">/ {activeAssignment?.maxMarks}</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={activeAssignment?.maxMarks}
                                                                value={gradeInput.marks}
                                                                onChange={(e) => setGradeInput(prev => ({ ...prev, marks: e.target.value }))}
                                                                placeholder="e.g. 85"
                                                                className="w-full bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200"
                                                                autoFocus
                                                            />
                                                        </div>

                                                        {/* Remarks input */}
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                                                Remarks <span className="text-slate-600 normal-case font-normal">(optional)</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={gradeInput.remarks}
                                                                onChange={(e) => setGradeInput(prev => ({ ...prev, remarks: e.target.value }))}
                                                                placeholder="Good work, needs improvement..."
                                                                className="w-full bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200"
                                                            />
                                                        </div>

                                                        {/* Save button */}
                                                        <button
                                                            onClick={() => handleGrade(sub._id)}
                                                            disabled={gradingLoading}
                                                            className="flex-shrink-0 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 h-[38px]"
                                                        >
                                                            {gradingLoading ? (
                                                                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                            {gradingLoading ? "Saving..." : "Save"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* UPDATE MODAL */}
            {updateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setUpdateModal(false)} />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-100" style={{ fontFamily: "'DM Serif Display', serif" }}>Update Assignment</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Edit and save your changes</p>
                            </div>
                            <button onClick={() => setUpdateModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
                            <div>
                                <label className={labelClass}>Title</label>
                                <input type="text" name="title" value={updateData.title} onChange={handleUpdateChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea name="description" value={updateData.description} onChange={handleUpdateChange} rows={3}
                                    className="w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 resize-none" />
                            </div>
                            <div>
                                <label className={labelClass}>Subject</label>
                                <input type="text" name="subject" value={updateData.subject} onChange={handleUpdateChange} className={inputClass} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Max Marks</label>
                                    <input type="number" name="maxMarks" value={updateData.maxMarks} onChange={handleUpdateChange} className={inputClass} min={0} />
                                </div>
                                <div>
                                    <label className={labelClass}>Semester</label>
                                    <input type="number" name="targetSemester" value={updateData.targetSemester} onChange={handleUpdateChange} className={inputClass} min={1} max={8} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Deadline</label>
                                <input type="date" name="deadLine" value={updateData.deadLine} onChange={handleUpdateChange} className={inputClass} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setUpdateModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg transition-all duration-200">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold py-2.5 rounded-lg transition-all duration-200">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}