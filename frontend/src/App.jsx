import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Navbar from "./components/Navbar";
import SendMoney from "./pages/SendMoney";
import ReceiveMoney from "./pages/ReceiveMoney";
import Transactions from "./pages/Transactions";
import Investments from "./pages/Investments";

function App() {
  // 🔥 Read user instantly from localStorage (runs on first page load)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // 🔥 Auto-update user when login/signup/logout happens
  useEffect(() => {
    const syncUser = setInterval(() => {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;

      // Only update when changed
      if (JSON.stringify(parsed) !== JSON.stringify(user)) {
        setUser(parsed);
      }
    }, 200);

    return () => clearInterval(syncUser);
  }, [user]);

  return (
    <Router>
      <Navbar user={user} />

      <Routes>
        {/* Default → always go to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Before login, show login/signup only */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* PROTECTED ROUTES — only for logged-in users */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/send"
          element={user ? <SendMoney /> : <Navigate to="/login" />}
        />

        <Route
          path="/receive"
          element={user ? <ReceiveMoney /> : <Navigate to="/login" />}
        />

        <Route
          path="/transactions"
          element={user ? <Transactions /> : <Navigate to="/login" />}
        />

        <Route
          path="/investments"
          element={user ? <Investments /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
