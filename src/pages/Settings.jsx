import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../Firebase";
import "../styles/Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currency, setCurrency] = useState("INR");

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [renewalAlerts, setRenewalAlerts] =
    useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] =
    useState(false);

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    setName(currentUser.displayName || "");
    setEmail(currentUser.email || "");

    loadSettings(currentUser.uid);
  }, [navigate]);

  /* =========================
     LOAD FIRESTORE SETTINGS
  ========================= */

  const loadSettings = async (uid) => {
    try {
      const settingsRef = doc(
        db,
        "users",
        uid,
        "settings",
        "preferences"
      );

      const snapshot = await getDoc(settingsRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setCurrency(data.currency || "INR");

        setEmailNotifications(
          data.emailNotifications ?? true
        );

        setRenewalAlerts(
          data.renewalAlerts ?? true
        );
      }
    } catch (error) {
      console.error(
        "Error loading settings:",
        error
      );
    }
  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile(user, {
        displayName: name.trim(),
      });

      const settingsRef = doc(
        db,
        "users",
        user.uid,
        "settings",
        "preferences"
      );

      await setDoc(
        settingsRef,
        {
          currency,
          emailNotifications,
          renewalAlerts,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      alert("Settings saved successfully.");

    } catch (error) {
      console.error(
        "Error saving settings:",
        error
      );

      alert(
        "Unable to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!oldPassword || !newPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      const credential =
        EmailAuthProvider.credential(
          user.email,
          oldPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        newPassword
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      alert("Password changed successfully.");

    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        alert("Current password is incorrect.");
      } else if (
        error.code ===
        "auth/wrong-password"
      ) {
        alert("Current password is incorrect.");
      } else {
        alert(
          "Unable to change password. Please try again."
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login");

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      alert("Unable to logout.");
    }
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your Monetra account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteUser(user);

      navigate("/");

    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      if (
        error.code ===
        "auth/requires-recent-login"
      ) {
        alert(
          "For security, please log out and log in again before deleting your account."
        );
      } else {
        alert(
          "Unable to delete your account."
        );
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>
          <span className="settings-eyebrow">
            MONETRA SETTINGS
          </span>

          <h1>Settings</h1>

          <p>
            Manage your profile, preferences and
            account security.
          </p>
        </div>

      </div>


      {/* PROFILE */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>
            <h2>Profile</h2>

            <p>
              Manage your personal information.
            </p>
          </div>

          <div className="settings-avatar">
            {name
              ? name.charAt(0).toUpperCase()
              : "U"}
          </div>

        </div>


        <div className="settings-form-grid">

          <div className="settings-field">

            <label>Full Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your name"
            />

          </div>


          <div className="settings-field">

            <label>Email Address</label>

            <input
              type="email"
              value={email}
              disabled
            />

            <small>
              Email is managed by your Firebase
              account.
            </small>

          </div>

        </div>

      </section>


      {/* PREFERENCES */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>
            <h2>Preferences</h2>

            <p>
              Customize how Monetra works for you.
            </p>
          </div>

        </div>


        <div className="settings-option">

          <div>
            <strong>Currency</strong>

            <span>
              Choose the currency used throughout
              Monetra.
            </span>
          </div>

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          >
            <option value="INR">
              ₹ INR — Indian Rupee
            </option>

            <option value="USD">
              $ USD — US Dollar
            </option>

            <option value="EUR">
              € EUR — Euro
            </option>

            <option value="GBP">
              £ GBP — British Pound
            </option>
          </select>

        </div>


        <div className="settings-option">

          <div>
            <strong>
              Email Notifications
            </strong>

            <span>
              Receive important updates about
              your subscriptions.
            </span>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              emailNotifications
                ? "active"
                : ""
            }`}
            onClick={() =>
              setEmailNotifications(
                !emailNotifications
              )
            }
          >
            <span></span>
          </button>

        </div>


        <div className="settings-option">

          <div>
            <strong>
              Renewal Alerts
            </strong>

            <span>
              Get reminders before subscriptions
              renew.
            </span>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              renewalAlerts
                ? "active"
                : ""
            }`}
            onClick={() =>
              setRenewalAlerts(
                !renewalAlerts
              )
            }
          >
            <span></span>
          </button>

        </div>

      </section>


      {/* SECURITY */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>
            <h2>Security</h2>

            <p>
              Keep your Monetra account secure.
            </p>
          </div>

        </div>


        <form
          className="password-form"
          onSubmit={handleChangePassword}
        >

          <div className="settings-field">

            <label>
              Current Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
              placeholder="Enter current password"
            />

          </div>


          <div className="settings-field">

            <label>
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
            />

          </div>


          <div className="settings-field">

            <label>
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm new password"
            />

          </div>


          <button
            type="submit"
            className="settings-secondary-btn"
            disabled={passwordLoading}
          >
            {passwordLoading
              ? "Updating..."
              : "Change Password"}
          </button>

        </form>

      </section>


      {/* SAVE */}

      <div className="settings-save-area">

        <button
          className="settings-save-btn"
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>


      {/* ACCOUNT */}

      <section className="settings-card danger-card">

        <div className="settings-card-heading">

          <div>
            <h2>Account</h2>

            <p>
              Manage your Monetra account.
            </p>
          </div>

        </div>


        <div className="account-actions">

          <button
            className="logout-settings-btn"
            onClick={handleLogout}
          >
            Log Out
          </button>


          <button
            className="delete-account-btn"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>

        </div>

      </section>

    </div>
  );
}

export default Settings;