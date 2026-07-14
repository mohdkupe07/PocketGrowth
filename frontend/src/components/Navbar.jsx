import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/transactions/received/pending/${user.id}`
        );
        const data = await res.json();
        if (res.ok) setPendingCount(data.transactions.length);
      } catch (err) {}
    };

    fetchCount();
    const interval = setInterval(fetchCount, 4000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav
      style={{
        background: "#1e293b",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #334155",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontWeight: 700, fontSize: "1.6rem", color: "#22c55e" }}>
        💰 PocketGrowth
      </h1>

      {user && (
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/send" label="Send Money" />
          <NavLink
            to="/receive"
            label={`Received ${pendingCount > 0 ? `(${pendingCount})` : ""}`}
          />
          <NavLink to="/transactions" label="Transactions" />
          <NavLink to="/investments" label="Investments" />

          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "white",
        fontWeight: 500,
        fontSize: "1rem",
      }}
    >
      {label}
    </Link>
  );
}
