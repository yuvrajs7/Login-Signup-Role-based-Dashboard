import React, { useState, useEffect, useRef } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import "./App.css";

const FormContainer = () => {
  const hasShownAlert = useRef(false); // track if alert already shown
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (!hasShownAlert.current) {
      hasShownAlert.current = true;
      setTimeout(() => {
        alert(
          "For Admin Login:\nEmail:admin@gmail.com\nPassword:Admin@123\nFor Employee Login:\nEmail:testemp1@gmail.com\nPassword:admin@123\n\nNote:\nUser must update the department role salary and profile picture using the edit profile Functionality ",
        );
      }, 0); // optional delay to avoid double alerts in dev
    }
  }, []);

  return (
    <div className="form-container">
      <div className="toggle-buttons">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>
      {isLogin ? (
        <Login clickonsignup={() => setIsLogin(false)} />
      ) : (
        <SignUp clickonlogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default FormContainer;
