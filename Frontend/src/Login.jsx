import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000"; // or your actual deployed backend URL

const getToken = () => localStorage.getItem("token");
const isAuthenticated = () => !!getToken();

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

const validateToken = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) return true;
    logout();
    return false;
  } catch (err) {
    console.error("Token validation failed:", err);
    return false;
  }
};

function Login({ clickonsignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      validateToken().then((isValid) => {
        if (isValid) navigate("/dashboard");
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        Not a member?{" "}
        <span onClick={clickonsignup} style={{ color: "blue", cursor: "pointer" }}>
          Signup now
        </span>
      </p>
    </form>
  );
}

export default Login;
export { getToken, getUser, logout, validateToken };
