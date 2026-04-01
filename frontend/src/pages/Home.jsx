import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// JWT decode helper (Native implementation)
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // "student" | "teacher" | null

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded?.role) {
        setUserRole(decoded.role.toLowerCase());
      }
    }
  }, []);

  const handleDashboardClick = (cardRole) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to access the dashboard.");
      navigate("/login");
      return;
    }

    // Role-based Access Control
    if (userRole === cardRole) {
      navigate(`/${cardRole}`);
    } else {
      alert(`Access Denied! Your role is "${userRole}", which does not have access to the ${cardRole} dashboard.`);
    }
  };

  const cards = [
    {
      role: "student",
      title: "Student Portal",
      subtitle: "Submit assignments & track your academic progress",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
      gradient: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30 hover:border-blue-400",
      accent: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300",
      btnClass: "bg-blue-600 hover:bg-blue-500",
      features: ["View New Assignments", "Upload Submissions", "Check Grades", "Performance Analytics"],
    },
    {
      role: "teacher",
      title: "Faculty Dashboard",
      subtitle: "Create assignments and evaluate student work",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      ),
      gradient: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30 hover:border-emerald-400",
      accent: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300",
      btnClass: "bg-emerald-600 hover:bg-emerald-500",
      features: ["Post New Tasks", "Review Submissions", "Provide Feedback", "Manage Class Rosters"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Assignment<span className="text-blue-400">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {userRole && (
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-blue-300">
              Active Role: <span className="text-white capitalize">{userRole}</span>
            </span>
          )}
          {!userRole ? (
            <button onClick={() => navigate("/login")} className="px-5 py-2 text-sm font-semibold bg-blue-600 rounded-lg hover:bg-blue-500 transition-all">
              Login
            </button>
          ) : (
            <button 
              onClick={() => { localStorage.removeItem("token"); setUserRole(null); }}
              className="px-5 py-2 text-sm font-semibold bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="relative z-10 text-center pt-24 pb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-black mb-6">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">AssignmentHub</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Please select your portal. Your identity is automatically verified via secure tokens.
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => {
          const isMyRole = userRole === card.role;
          const isLoggedIn = !!userRole;

          return (
            <div
              key={card.role}
              onClick={() => handleDashboardClick(card.role)}
              className={`
                relative rounded-3xl border p-8 transition-all duration-300 group cursor-pointer
                bg-gradient-to-b ${card.gradient} ${card.border}
                ${isMyRole ? "ring-2 ring-blue-500 scale-[1.03] shadow-2xl shadow-blue-500/10" : ""}
                ${isLoggedIn && !isMyRole ? "opacity-40 grayscale cursor-not-allowed" : "hover:scale-[1.02]"}
              `}
            >
              {isMyRole && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-tighter">
                  Authorized Access
                </div>
              )}

              <div className={`mb-6 ${card.accent}`}>{card.icon}</div>
              
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{card.subtitle}</p>

              <ul className="space-y-3 mb-8">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${card.accent} bg-current`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`
                  w-full py-3 rounded-xl text-sm font-bold transition-all
                  ${isMyRole ? card.btnClass + " text-white" : "bg-white/5 text-gray-500 border border-white/5"}
                `}
              >
                {isMyRole ? "Enter Dashboard →" : isLoggedIn ? "Access Restricted" : "Login Required"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}