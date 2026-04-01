import React, { useState } from 'react'
import API from './api/axios.js';
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        fullName: "",
        email: "",
        password: "",
        role: "",
        createdAt: Date.now(),
        targetSemester: 0
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await API.post("users/register", formData)
            if (res.status === 201) {
                alert("User created successfully");
                navigate("/login");
            }
            setFormData({
                name: "",
                fullName: "",
                email: "",
                password: "",
                role: "",
                createdAt: Date.now(),
                targetSemester: 0

            })
        } catch (error) {
            setError(error.response.data.message || "something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return (
   <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 font-mono">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
 
      <div className="relative w-full max-w-md">
        {/* Glow accent */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
 
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs text-indigo-400 tracking-widest uppercase">New Account</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-sm mt-1">Fill in the details below to get started</p>
          </div>
 
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}
 
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name + Full Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">Username</label>
                <input
                  type="text"
                  name="name"
                  placeholder="jdoe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>
              <div className="group">
                <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>
            </div>
 
            {/* Email */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>
            </div>
 
            {/* Password */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>
            </div>
 
            {/* Row 2: Role + Target Semester */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="Student"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">Semester</label>
                <input
                  type="text"
                  name="targetSemester"
                  placeholder="Sem 4"
                  value={formData.targetSemester}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>
            </div>
 
            {/* Divider */}
            <div className="border-t border-slate-800 my-2" />
 
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-all duration-200 tracking-wide group"
            >
              <span className={`flex items-center justify-center gap-2 transition-all duration-200 ${loading ? "opacity-0" : "opacity-100"}`}>
                Create Account
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              )}
            </button>
          </form>
 
          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
    )
}
