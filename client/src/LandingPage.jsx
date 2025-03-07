import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Welcome</h2>
        <div className="mb-3">
          <Link to="/register" className="btn btn-success w-100 rounded-0">
            Register
          </Link>
        </div>
        <div>
          <Link to="/login" className="btn btn-primary w-100 rounded-0">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
