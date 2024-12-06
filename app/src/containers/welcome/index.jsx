import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../img/googlelogo.png";
import "./styles.scss";

const Welcome = () => {
  const { googleSignIn, user } = UserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError(""); 
      await googleSignIn();
      navigate("/about");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="home">
      <div className="home_text-wrapper">
        <h1>Welcome to RocketMetrics</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="google-auth-button" onClick={handleGoogleSignIn}>
          <div className="google-icon-wrapper">
            <img
              src={logo}
              alt="Google Logo"
              className="google-icon"
            />
          </div>
          <span className="button-text">Sign in with Google</span>
        </button>
      </div>
    </section>
  );
};

export default Welcome;