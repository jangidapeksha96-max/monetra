
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import {
  signOut,
} from "firebase/auth";

import { auth, db } from "../Firebase";
import "../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [newSubscription, setNewSubscription] = useState({
    name: "",
    price: "",
    billing: "Monthly",
    renewalDate: "",
    category: "Entertainment",
    paymentMethod: "UPI",
  });

  /* =========================
     LOAD FIRESTORE DATA
  ========================= */

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const subscriptionsRef = collection(db, "subscriptions");

    const q = query(
      subscriptionsRef,
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setSubscriptions(data);
      },
      (error) => {
        console.error(
          "Error loading subscriptions:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  /* =========================
     EDIT FROM URL
  ========================= */

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (!editId || subscriptions.length === 0) {
      return;
    }

    const subscription = subscriptions.find(
      (item) => item.id === editId
    );

    if (subscription) {
      handleEdit(subscription);
    }
  }, [searchParams, subscriptions]);

  /* =========================
     INPUT
  ========================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewSubscription((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (subscription) => {
    setEditingId(subscription.id);

    setNewSubscription({
      name: subscription.name || "",
      price: subscription.price || "",
      billing: subscription.billing || "Monthly",
      renewalDate: subscription.renewalDate || "",
      category:
        subscription.category || "Entertainment",
      paymentMethod:
        subscription.paymentMethod || "UPI",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setEditingId(null);

    setNewSubscription({
      name: "",
      price: "",
      billing: "Monthly",
      renewalDate: "",
      category: "Entertainment",
      paymentMethod: "UPI",
    });

    navigate("/dashboard", {
      replace: true,
    });
  };

  /* =========================
     SAVE SUBSCRIPTION
  ========================= */

  const handleSaveSubscription = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    if (
      !newSubscription.name.trim() ||
      !newSubscription.price
    ) {
      alert(
        "Please enter subscription name and price."
      );
      return;
    }

    try {
      if (editingId) {
        const subscriptionRef = doc(
          db,
          "subscriptions",
          editingId
        );

        await updateDoc(subscriptionRef, {
          name: newSubscription.name.trim(),
          price: Number(newSubscription.price),
          billing: newSubscription.billing,
          renewalDate:
            newSubscription.renewalDate,
          category: newSubscription.category,
          paymentMethod:
            newSubscription.paymentMethod,
        });
      } else {
        await addDoc(
          collection(db, "subscriptions"),
          {
            name: newSubscription.name.trim(),
            price: Number(newSubscription.price),
            billing: newSubscription.billing,
            renewalDate:
              newSubscription.renewalDate,
            category: newSubscription.category,
            paymentMethod:
              newSubscription.paymentMethod,
            status: "Active",
            userId: auth.currentUser.uid,
            createdAt: new Date(),
          }
        );
      }

      resetForm();

    } catch (error) {
      console.error(
        "Error saving subscription:",
        error
      );

      alert(
        "Something went wrong while saving the subscription."
      );
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subscription?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "subscriptions", id)
      );
    } catch (error) {
      console.error(
        "Error deleting subscription:",
        error
      );

      alert("Unable to delete subscription.");
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

      alert(
        "Unable to logout. Please try again."
      );
    }
  };

  /* =========================
     CALCULATIONS
  ========================= */

  const monthlySpending =
    subscriptions.reduce(
      (total, subscription) => {
        if (
          subscription.billing === "Monthly"
        ) {
          return (
            total +
            Number(subscription.price || 0)
          );
        }

        return total;
      },
      0
    );

  const yearlySpending =
    subscriptions.reduce(
      (total, subscription) => {
        const price = Number(
          subscription.price || 0
        );

        if (
          subscription.billing === "Monthly"
        ) {
          return total + price * 12;
        }

        return total + price;
      },
      0
    );

  const upcomingSubscriptions =
    [...subscriptions]
      .filter(
        (subscription) =>
          subscription.renewalDate
      )
      .sort(
        (a, b) =>
          new Date(a.renewalDate) -
          new Date(b.renewalDate)
      )
      .slice(0, 3);

  /* =========================
     SEARCH
  ========================= */

  const filteredSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =========================
     CATEGORY TOTALS
  ========================= */

  const categories = [
    {
      name: "Entertainment",
      color: "green",
    },
    {
      name: "Productivity",
      color: "blue",
    },
    {
      name: "Education",
      color: "orange",
    },
    {
      name: "Others",
      color: "brown",
    },
  ];

  const getCategoryAmount = (category) => {
    return subscriptions.reduce(
      (total, subscription) => {
        if (
          subscription.category ===
            category &&
          subscription.billing ===
            "Monthly"
        ) {
          return (
            total +
            Number(subscription.price || 0)
          );
        }

        return total;
      },
      0
    );
  };

  const getCategoryPercentage = (
    category
  ) => {
    if (monthlySpending === 0) {
      return 0;
    }

    return Math.round(
      (getCategoryAmount(category) /
        monthlySpending) *
        100
    );
  };

  /* =========================
     DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     USER NAME
  ========================= */

  const userName =
    auth.currentUser?.displayName ||
    "there";

  return (
    <div className="dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">

          <div className="brand-symbol">
            <span></span>
            <span></span>
          </div>

          <h1>Monetra</h1>

          <p>
            Manage every subscription.
            <br />
            Effortlessly.
          </p>

        </div>

       <nav className="dashboard-nav">

  <Link
    to="/dashboard"
    className={`dashboard-nav-item ${
      location.pathname === "/dashboard" ? "active" : ""
    }`}
  >
    <span>⌂</span>
    Dashboard
  </Link>

  <Link
    to="/subscriptions"
    className={`dashboard-nav-item ${
      location.pathname === "/subscriptions" ? "active" : ""
    }`}
  >
    <span>▣</span>
    Subscriptions
  </Link>

  <Link
    to="/analytics"
    className={`dashboard-nav-item ${
      location.pathname === "/analytics" ? "active" : ""
    }`}
  >
    <span>◔</span>
    Analytics
  </Link>

  {/* Settings Button */}
  <Link
    to="/settings"
    className={`dashboard-nav-item ${
      location.pathname === "/settings" ? "active" : ""
    }`}
  >
    <span>⚙</span>
    Settings
  </Link>

</nav>

        <div className="dashboard-sidebar-bottom">

          <div className="sidebar-tip">

            <p>
              Take control of your
              subscriptions and save
              smarter with Monetra.
            </p>

            <div className="tip-leaves">
              🌿
            </div>

          </div>

          {/* REAL LOGOUT */}

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Log Out
          </button>

        </div>

      </aside>


      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h2>
              Hello, {userName} 👋
            </h2>

            <p>
              Here's your subscription overview.
            </p>

          </div>

          <div className="dashboard-header-right">

            <div className="dashboard-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search anything..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="dashboard-profile">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <span className="profile-arrow">
              ⌄
            </span>

          </div>

        </header>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="dashboard-content-grid">

          <div className="dashboard-primary">

            {/* STATS */}

            <section className="dashboard-stats">

              <div className="dashboard-stat-card">

                <div className="stat-icon green-icon">
                  ₹
                </div>

                <div>

                  <span>
                    Monthly Spending
                  </span>

                  <h3>
                    ₹
                    {monthlySpending.toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  <small className="positive">
                    ↗ 12% from last month
                  </small>

                </div>

              </div>


              <div className="dashboard-stat-card">

                <div className="stat-icon blue-icon">
                  ◫
                </div>

                <div>

                  <span>
                    Yearly Spending
                  </span>

                  <h3>
                    ₹
                    {yearlySpending.toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  <small className="blue-text">
                    ↗ 8% from last year
                  </small>

                </div>

              </div>


              <div className="dashboard-stat-card">

                <div className="stat-icon peach-icon">
                  ▤
                </div>

                <div>

                  <span>
                    Total Subscriptions
                  </span>

                  <h3>
                    {subscriptions.length}
                  </h3>

                  <small className="brown-text">
                    Active subscriptions
                  </small>

                </div>

              </div>


              <div className="dashboard-stat-card">

                <div className="stat-icon brown-icon">
                  ◷
                </div>

                <div>

                  <span>
                    Upcoming Renewals
                  </span>

                  <h3>
                    {upcomingSubscriptions.length}
                  </h3>

                  <small className="brown-text">
                    In next 7 days
                  </small>

                </div>

              </div>

            </section>


            {/* ADD SUBSCRIPTION */}

            <section className="dashboard-add-section">

              <div className="add-section-heading">

                <div>

                  <h2>
                    {editingId
                      ? "Edit Subscription"
                      : "Add New Subscription"}
                  </h2>

                  <p>
                    {editingId
                      ? "Update your subscription details."
                      : "Track your new subscription in one place."}
                  </p>

                </div>

                <div className="add-leaf-decoration">
                  🌿
                </div>

              </div>


              <form
                className="dashboard-form"
                onSubmit={
                  handleSaveSubscription
                }
              >

                <div className="form-group">

                  <label>
                    Subscription Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Netflix"
                    value={
                      newSubscription.name
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Amount (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="e.g., 649"
                    value={
                      newSubscription.price
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Billing Cycle
                  </label>

                  <select
                    name="billing"
                    value={
                      newSubscription.billing
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="Monthly">
                      Monthly
                    </option>

                    <option value="Yearly">
                      Yearly
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Renewal Date
                  </label>

                  <input
                    type="date"
                    name="renewalDate"
                    value={
                      newSubscription.renewalDate
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      newSubscription.category
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option>
                      Entertainment
                    </option>

                    <option>
                      Productivity
                    </option>

                    <option>
                      Education
                    </option>

                    <option>
                      Others
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Payment Method
                  </label>

                  <select
                    name="paymentMethod"
                    value={
                      newSubscription.paymentMethod
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option>
                      UPI
                    </option>

                    <option>
                      Credit Card
                    </option>

                    <option>
                      Debit Card
                    </option>

                    <option>
                      Net Banking
                    </option>

                  </select>

                </div>


                <div className="form-submit-area">

                  <button
                    type="submit"
                    className="dashboard-save-btn"
                  >
                    +
                    {" "}
                    {editingId
                      ? "Update Subscription"
                      : "Add Subscription"}
                  </button>


                  {editingId && (

                    <button
                      type="button"
                      className="dashboard-cancel-btn"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>

                  )}

                </div>

              </form>

            </section>


            {/* SUBSCRIPTIONS */}

            <section className="dashboard-subscriptions">

              <div className="section-header">

                <div>

                  <h2>
                    Your Subscriptions
                  </h2>

                  <p>
                    All your active subscriptions
                  </p>

                </div>

                <Link
                  to="/subscriptions"
                  className="view-all-btn"
                >
                  View All →
                </Link>

              </div>


              {filteredSubscriptions.length ===
              0 ? (

                <div className="dashboard-empty">

                  <h3>
                    No subscriptions yet
                  </h3>

                  <p>
                    Add your first subscription
                    above to start tracking.
                  </p>

                </div>

              ) : (

                <div className="subscription-table">

                  {filteredSubscriptions
                    .slice(0, 5)
                    .map(
                      (subscription) => (

                        <div
                          className="subscription-row"
                          key={
                            subscription.id
                          }
                        >

                          <div className="subscription-brand">
                            {subscription.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>


                          <div className="subscription-name">

                            <strong>
                              {subscription.name}
                            </strong>

                            <span>
                              {subscription.category ||
                                "Other"}
                            </span>

                          </div>


                          <div className="subscription-price">

                            <strong>
                              ₹
                              {Number(
                                subscription.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            <span>
                              {subscription.billing}
                            </span>

                          </div>


                          <div className="subscription-renewal">

                            <span>
                              Renews on
                            </span>

                            <strong>
                              {formatDate(
                                subscription.renewalDate
                              )}
                            </strong>

                          </div>


                          <span className="status-badge">
                            {subscription.status ||
                              "Active"}
                          </span>


                          <div className="row-actions">

                            <button
                              onClick={() =>
                                handleEdit(
                                  subscription
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  subscription.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      )
                    )}

                </div>

              )}


              {subscriptions.length > 5 && (

                <Link
                  to="/subscriptions"
                  className="all-subscriptions-link"
                >
                  View All Subscriptions →
                </Link>

              )}

            </section>


            {/* SAVINGS BANNER */}

            <section className="dashboard-savings-banner">

              <div className="savings-symbol">
                ♕
              </div>

              <div>

                <h2>
                  Stay in control. Save more.
                </h2>

                <p>
                  Cancel what you don't use
                  and invest in what matters.
                </p>

              </div>

              <Link
                to="/analytics"
                className="savings-btn"
              >
                Explore Analytics →
              </Link>

            </section>

          </div>


          {/* =========================
              RIGHT COLUMN
          ========================= */}

          <aside className="dashboard-right-column">

            {/* MONTHLY OVERVIEW */}

            <section className="right-card">

              <div className="right-card-header">

                <h2>
                  Monthly Overview
                </h2>

                <select defaultValue="month">

                  <option value="month">
                    This Month
                  </option>

                </select>

              </div>

              <p className="right-label">
                Total Spending
              </p>

              <div className="overview-total">
                ₹
                {monthlySpending.toLocaleString(
                  "en-IN"
                )}
              </div>

              <div className="overview-change">
                ↗ 12%
                <span>
                  vs last month
                </span>
              </div>

              <div className="overview-list">

                {categories.map(
                  (category) => (

                    <div
                      className="overview-item"
                      key={category.name}
                    >

                      <div>

                        <span
                          className={`category-dot ${category.color}`}
                        ></span>

                        {category.name}

                      </div>

                      <strong>
                        ₹
                        {getCategoryAmount(
                          category.name
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>

              <Link
                to="/analytics"
                className="card-link"
              >
                View Full Analytics →
              </Link>

            </section>


            {/* BREAKDOWN */}

            <section className="right-card">

              <div className="right-card-header">

                <h2>
                  Spending Breakdown
                </h2>

              </div>


              <div className="breakdown-content">

                <div className="donut-chart">

                  <div className="donut-inner">

                    <strong>
                      ₹
                      {monthlySpending.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      Total
                    </span>

                  </div>

                </div>


                <div className="breakdown-list">

                  {categories.map(
                    (category) => (

                      <div
                        className="breakdown-item"
                        key={category.name}
                      >

                        <div>

                          <span
                            className={`category-dot ${category.color}`}
                          ></span>

                          {category.name}

                        </div>

                        <strong>
                          {getCategoryPercentage(
                            category.name
                          )}
                          %
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>


              <Link
                to="/analytics"
                className="card-link"
              >
                View Full Analytics →
              </Link>

            </section>


            {/* UPCOMING */}

            <section className="right-card">

              <div className="right-card-header">

                <h2>
                  Upcoming Renewals
                </h2>

                <Link
                  to="/subscriptions"
                  className="small-link"
                >
                  View All →
                </Link>

              </div>


              <div className="upcoming-list">

                {upcomingSubscriptions.length ===
                0 ? (

                  <p className="no-renewals">
                    No upcoming renewals.
                  </p>

                ) : (

                  upcomingSubscriptions.map(
                    (subscription) => (

                      <div
                        className="upcoming-item"
                        key={
                          subscription.id
                        }
                      >

                        <div className="upcoming-logo">
                          {subscription.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="upcoming-info">

                          <strong>
                            {subscription.name}
                          </strong>

                          <span>
                            Renews on{" "}
                            {formatDate(
                              subscription.renewalDate
                            )}
                          </span>

                        </div>

                        <div className="upcoming-price">

                          <strong>
                            ₹
                            {Number(
                              subscription.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span>
                            {subscription.billing}
                          </span>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;

