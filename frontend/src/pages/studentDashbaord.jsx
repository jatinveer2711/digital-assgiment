import React, { useEffect, useState } from 'react'
import API from './api/axios';
import { useNavigate } from 'react-router-dom';


export default function studentDashbaord() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [fetchData, setFetchData] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sumbissionData, setSumbissionData] = useState({
    assigment: "",
    student: "",
    fileUrl: "",
  })

  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("assignments/getAllAssigment", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setFetchData(res.data.assigments);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    };

  };

  const handleLogout = () => {
    let confirmLogout = window.confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login")
    }
  }



  const handleSubmit = async (assignmentId) => {

    setError("");
    setLoading(true);

    try {

      const res = await API.post(
        "sumbission/create",
        {
          assigment: assignmentId,
          fileUrl: sumbissionData.fileUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 201) {
        alert("Assignment submitted successfully");
        setSumbissionData({
          fileUrl: ""
        })
      }

      fetchAssignments();

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

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


      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-950/50 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-zinc-500 text-sm mb-6">
            <span className="w-4 h-4 border-2 border-zinc-700 border-t-amber-400 rounded-full animate-spin"></span>
            Loading assignments...
          </div>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {fetchData.map((assignment) => (
            <div
              key={assignment._id}
              className="group relative bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 rounded-2xl p-6 transition-all duration-300"
            >

              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>

              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-lg font-semibold">
                  {assignment.title}
                </h2>

                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                  Open
                </span>
              </div>

              <p className="text-zinc-400 text-sm mb-4">
                {assignment.description}
              </p>

              <div className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg mb-5 inline-flex items-center gap-2">
                Due: {assignment.deadLine.split("T")[0]}
              </div>

              <input
                type="text"
                placeholder="Paste assignment file URL"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-400 outline-none text-sm px-4 py-2.5 rounded-xl mb-4"
                onChange={(e) =>
                  setSumbissionData({
                    ...sumbissionData,
                    fileUrl: e.target.value,
                  })
                }
              />

              <button
                onClick={() => handleSubmit(assignment._id)}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm px-6 py-2.5 rounded-xl transition"
              >
                Submit Assignment
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

