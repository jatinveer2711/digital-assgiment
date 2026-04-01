import React, { useEffect, useState } from 'react'
import API from './api/axios';
import { useNavigate } from 'react-router-dom';

export default function Sumbission() {
    const token = localStorage.getItem("token");
    const [fetchData, setFetchData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchSumbission = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await API.get("sumbission/fetch-student", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFetchData(res.data.sumbissions);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        let confirmLogout = window.confirm("Are you sure you want to Logout?");
        if (confirmLogout) {
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchSumbission();
    }, [token]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');`}</style>

            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Left */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                            Portal
                        </p>
                        <h1 className="text-xl font-bold tracking-tight">
                            Student Dashboard
                        </h1>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        <a className="text-zinc-400 hover:text-amber-400 transition">
                            Assignments
                        </a>
                        <a href="/sumbission" className="text-zinc-400 hover:text-amber-400 transition">
                            Submissions
                        </a>
                        <a href="/" className="text-zinc-400 hover:text-amber-400 transition">
                            Home
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-amber-400 text-black rounded-lg font-semibold hover:bg-amber-300 transition"
                        >
                            Logout
                        </button>
                    </nav>

                    {/* Hamburger Button (Mobile) */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-zinc-300 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-6 h-0.5 bg-zinc-300 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-6 h-0.5 bg-zinc-300 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>

                </div>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-4 text-sm">
                        <a className="text-zinc-400 hover:text-amber-400 transition">
                            Assignments
                        </a>
                        <a href="/sumbission" className="text-zinc-400 hover:text-amber-400 transition">
                            Submissions
                        </a>
                        <a href="/" className="text-zinc-400 hover:text-amber-400 transition">
                            Home
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 bg-amber-400 text-black rounded-lg font-semibold hover:bg-amber-300 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Page heading */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        My Submissions
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">Track all your submitted assignments and grades</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-950/50 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-xl">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <span className="w-8 h-8 border-2 border-zinc-700 border-t-amber-400 rounded-full animate-spin"></span>
                        <p className="text-zinc-500 text-sm">Loading submissions...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && fetchData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-zinc-400 font-medium">No submissions yet</p>
                        <p className="text-zinc-600 text-sm">Submit an assignment to see it here</p>
                        <a href="/student" className="mt-2 text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-lg hover:bg-amber-400/20 transition">
                            Browse Assignments →
                        </a>
                    </div>
                )}

                {/* Submission Cards */}
                {!loading && fetchData.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {fetchData.map((sub) => {
                            const isGraded = sub.marks != null;
                            const maxMarks = sub.assignment?.maxMarks;

                            return (
                                <div
                                    key={sub._id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col"
                                >
                                    {/* Card top accent */}
                                    <div className={`h-1 w-full ${isGraded ? "bg-emerald-500" : "bg-amber-400"}`} />

                                    <div className="p-5 flex flex-col gap-4 flex-1">

                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-base font-semibold text-white leading-snug">
                                                {sub.assigment?.title || "Untitled Assignment"}
                                            </h2>
                                            <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${isGraded
                                                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                                : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                                                }`}>
                                                {isGraded ? "Graded" : "Submitted"}
                                            </span>
                                        </div>

                                        {/* Description (subject nahi hai response mein, description hai) */}
                                        {sub.assigment?.description && (
                                            <p className="text-xs text-zinc-500 -mt-2 line-clamp-2">
                                                {sub.assigment.description}
                                            </p>
                                        )}

                                        {/* ✅ Marks — fixed (was incorrectly using new Date()) */}
                                        <div className={`rounded-xl px-4 py-3 border flex items-center justify-between ${isGraded
                                            ? "bg-emerald-500/5 border-emerald-500/20"
                                            : "bg-zinc-800/60 border-zinc-700"
                                            }`}>
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-0.5">Marks Obtained</p>
                                                <p className={`text-xl font-bold ${isGraded ? "text-emerald-400" : "text-zinc-500"}`}>
                                                    {isGraded ? sub.marks : "—"}
                                                    {isGraded && maxMarks && (
                                                        <span className="text-sm font-normal text-zinc-500 ml-1">/ {maxMarks}</span>
                                                    )}
                                                </p>
                                            </div>
                                            {/* Score circle */}
                                            {isGraded && maxMarks && (
                                                <div className="relative w-12 h-12">
                                                    <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
                                                        <circle
                                                            cx="18" cy="18" r="15.9" fill="none"
                                                            stroke="#34d399" strokeWidth="3"
                                                            strokeDasharray={`${(sub.marks / maxMarks) * 100} 100`}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                                                        {Math.round((sub.marks / maxMarks) * 100)}%
                                                    </span>
                                                </div>
                                            )}
                                            {!isGraded && (
                                                <span className="text-xs text-zinc-600">Pending</span>
                                            )}
                                        </div>

                                        {/* Remarks */}
                                        {sub.remarks && (
                                            <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-lg px-3 py-2.5">
                                                <p className="text-xs text-zinc-500 mb-1">Teacher's Remarks</p>
                                                <p className="text-sm text-zinc-300">💬 {sub.remarks}</p>
                                            </div>
                                        )}

                                        {/* Footer — file + date */}
                                        <div className="mt-auto pt-1 flex items-center justify-between gap-3 flex-wrap">
                                            <span className="text-xs text-zinc-600">
                                                {sub?.createdAt
                                                    ? new Date(sub.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })
                                                    : "N/A"}
                                            </span>
                                            {sub.fileUrl && (
                                                <a
                                                    href={sub.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    View File
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}