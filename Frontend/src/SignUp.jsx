import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

function SignUp({ clickonlogin }) {
  const [firstName, setName] = useState("");
  const [lastName, setName2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/usercreated");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Fisrt Name"
        required
        value={firstName}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        required
        value={lastName}
        onChange={(e) => setName2(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email Address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Signup</button>
      <p>
        Already a member?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={clickonlogin}
        >
          Login now
        </span>
      </p>
    </form>
  );
}

export default SignUp;
