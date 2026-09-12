import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../Firebase";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email.");
      } else {
        alert("Unable to login. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <section className="login-left">

          <div className="login-brand">
            <h1>Monetra</h1>
          </div>

          <div className="login-left-content">

            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h2>
              Take control of
              <span> your money.</span>
            </h2>

            <p>
              Manage your subscriptions, track
              recurring expenses and make smarter
              financial decisions with Monetra.
            </p>

            <div className="login-feature">
              <span className="login-feature-dot"></span>
              Everything in one simple place.
            </div>

          </div>

          <div className="login-left-bottom">
            Simple. Smart. In control.
          </div>

        </section>


        <section className="login-right">

          <div className="login-card">

            <span className="login-small-title">
              WELCOME BACK
            </span>

            <h2>
              Log in to Monetra
            </h2>

            <p>
              Continue managing your subscriptions
              effortlessly.
            </p>


            <form
              className="login-form"
              onSubmit={handleLogin}
            >

              <div className="login-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>


              <div className="login-form-group">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

              </div>


              <div className="login-options">

                <span></span>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>

              </div>


              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Log In →"}
              </button>

            </form>


            <div className="login-signup">

              Don't have an account?

              {" "}

              <Link to="/signup">
                Create one
              </Link>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;