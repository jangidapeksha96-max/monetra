import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../Firebase";
import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim() || !email.trim() || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /* =========================
         CREATE FIREBASE ACCOUNT
      ========================= */

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const user = userCredential.user;

      /* =========================
         SAVE DISPLAY NAME
         IN FIREBASE AUTH
      ========================= */

      await updateProfile(user, {
        displayName: name.trim(),
      });

      /* =========================
         SAVE USER PROFILE
         IN FIRESTORE
      ========================= */

      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: user.email,
        currency: "INR",
        notifications: true,
        createdAt: serverTimestamp(),
      });

      /* =========================
         GO TO DASHBOARD
      ========================= */

      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("An account with this email already exists.");

      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");

      } else if (error.code === "auth/weak-password") {
        alert("Please choose a stronger password.");

      } else if (error.code === "auth/network-request-failed") {
        alert("Network error. Please check your internet connection.");

      } else {
        alert(
          "Unable to create account. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <section className="signup-left">

          <div className="signup-brand">
            <h1>Monetra</h1>
          </div>

          <div className="signup-left-content">

            <span className="signup-eyebrow">
              YOUR MONEY, SIMPLIFIED
            </span>

            <h2>
              Start managing
              <span> smarter.</span>
            </h2>

            <p>
              Create your Monetra account and
              take control of every subscription,
              renewal and recurring expense in
              one simple place.
            </p>

            <div className="signup-features">

              <div className="signup-feature">
                <span>✓</span>
                Track every subscription
              </div>

              <div className="signup-feature">
                <span>✓</span>
                Monitor your spending
              </div>

              <div className="signup-feature">
                <span>✓</span>
                Never miss a renewal
              </div>

            </div>

          </div>

          <div className="signup-left-bottom">
            <span className="signup-dot"></span>
            Simple. Smart. In control.
          </div>

        </section>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <section className="signup-right">

          <div className="signup-card">

            <div className="signup-heading">

              <span className="signup-small-title">
                WELCOME TO MONETRA
              </span>

              <h2>
                Create your account
              </h2>

              <p>
                Start your journey towards
                smarter subscription management.
              </p>

            </div>


            <form
              className="signup-form"
              onSubmit={handleSignup}
            >

              {/* NAME */}

              <div className="signup-form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />

              </div>


              {/* EMAIL */}

              <div className="signup-form-group">

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


              {/* PASSWORD */}

              <div className="signup-form-group">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="signup-form-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account →"}

              </button>

            </form>


            {/* LOGIN */}

            <div className="signup-login">

              Already have an account?

              <Link to="/login">
                Log in
              </Link>

            </div>


            <div className="signup-security">
              <span>●</span>
              Your information is securely protected
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Signup;