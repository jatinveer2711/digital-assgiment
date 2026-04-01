import React, { useState } from 'react'
import API from './api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const[formData,setFormData] = useState({
        email:"",
        password:""
    })
    const navigate = useNavigate();
    const [error ,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true)
        try {
            const res = await API.post("users/login",formData)
          localStorage.setItem("token",res.data.token);
          localStorage.setItem("role",res.data.role);
         navigate('/')
        } catch (error) {
            setError(error.response.data.message || "something went wrong")

        }finally{
            setLoading(false)
        }
    }
  return (
<div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
            <div className="max-w-md w-full bg-[#1e293b] rounded-xl shadow-2xl p-8 border border-gray-700">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 mt-2">Enter your credentials to access your account</p>
                </div>

                {/* Dark Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-lg">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#0f172a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#0f172a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-400">
                            <input type="checkbox" className="mr-2 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-offset-[#1e293b]" />
                            Remember me
                        </label>
                        <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Forgot password?</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/20 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </span>
                        ) : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    New here? <a href="/signup" className="text-blue-400 font-medium cursor-pointer hover:underline">Create an account</a>
                </p>
            </div>
        </div>
  )
}
