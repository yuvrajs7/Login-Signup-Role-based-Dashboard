import react from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Created() {
  const Navigate = useNavigate();
  return (
    <>
      <div className="form-container">
        <h1 className="toggle-buttons">User Created</h1>
        <p>
          Go to{" "}
          <span className="link" onClick={() => Navigate("/")}>
            {" "}
            Login
          </span>
        </p>
      </div>
    </>
  );
}
export default Created;
