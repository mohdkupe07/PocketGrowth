import { useState } from "react";

export default function AllowanceForm({ user, refreshUserData }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("⏳ Adding allowance...");
    try {
      const res = await fetch("http://localhost:5000/api/allowance/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, amount }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setAmount("");
        refreshUserData(); // reload balances
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage("❌ Failed to add allowance");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Add Allowance</h3>
      <form onSubmit={handleAdd}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}
