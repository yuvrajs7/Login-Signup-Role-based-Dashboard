import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "./Login";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        navigate("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return authenticated ? children : null;
}

export default ProtectedRoute;
