import { useEffect, useState } from "react";

export default function Investments() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [investments, setInvestments] = useState([]);
  const [totals, setTotals] = useState({ totalInvested: 0, totalReturns: 0, netWorth: 0 });

  useEffect(() => {
    if (user) fetchInvestments();
  }, [user]);

  const fetchInvestments = async () => {
    const res = await fetch(`http://localhost:5000/api/investments/${user.id}`);
    const data = await res.json();
    setInvestments(data.investments);
    setTotals({
      totalInvested: data.totalInvested,
      totalReturns: data.totalReturns,
      netWorth: data.netWorth,
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📈 Investments</h2>
      <p>Total Invested: ${totals.totalInvested}</p>
      <p>Total Returns: ${totals.totalReturns}</p>
      <p>Net Worth: ${totals.netWorth}</p>

      {investments.length > 0 ? (
        <ul style={{ marginTop: "10px" }}>
          {investments.map((inv) => (
            <li key={inv._id}>
              {inv.type.toUpperCase()} — ${inv.amount} (+${inv.returns} returns)
            </li>
          ))}
        </ul>
      ) : (
        <p>No investments yet.</p>
      )}

      <button
        onClick={async () => {
          await fetch("http://localhost:5000/api/investments/grow", { method: "PATCH" });
          fetchInvestments();
          alert("📈 Simulated growth!");
        }}
        style={{
          marginTop: "10px",
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Simulate Market Growth
      </button>
    </div>
  );
}
