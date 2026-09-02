import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import "../styles/Subscriptions.css";

function Subscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("cards");
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD SUBSCRIPTIONS
  ========================= */

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const subscriptionsRef = collection(
      db,
      "subscriptions"
    );

    const q = query(
      subscriptionsRef,
      where(
        "userId",
        "==",
        auth.currentUser.uid
      )
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

        setSubscriptions(data);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Error loading subscriptions:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this subscription?"
      );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "subscriptions", id)
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to delete subscription."
      );
    }
  };

  /* =========================
     PAUSE / RESUME
  ========================= */

  const handleToggleStatus = async (
    subscription
  ) => {
    try {
      const newStatus =
        subscription.status === "Paused"
          ? "Active"
          : "Paused";

      await updateDoc(
        doc(
          db,
          "subscriptions",
          subscription.id
        ),
        {
          status: newStatus,
        }
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Unable to update subscription status."
      );
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (id) => {
    navigate(
      `/dashboard?edit=${id}`
    );
  };

  /* =========================
     DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================
     FILTER
  ========================= */

  const filteredSubscriptions =
    subscriptions.filter(
      (subscription) => {
        const matchesSearch =
          subscription.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        if (!matchesSearch) {
          return false;
        }

        if (filter === "All") {
          return true;
        }

        if (
          filter === "Monthly" ||
          filter === "Yearly"
        ) {
          return (
            subscription.billing ===
            filter
          );
        }

        if (filter === "Active") {
          return (
            subscription.status !==
            "Paused"
          );
        }

        if (filter === "Paused") {
          return (
            subscription.status ===
            "Paused"
          );
        }

        return (
          subscription.category ===
          filter
        );
      }
    );

  /* =========================
     TOTAL
  ========================= */

  const monthlyTotal =
    subscriptions.reduce(
      (total, subscription) => {
        if (
          subscription.billing ===
          "Monthly"
        ) {
          return (
            total +
            Number(
              subscription.price || 0
            )
          );
        }

        return total;
      },
      0
    );

  return (
    <div className="subscriptions-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="subscriptions-sidebar">

        <div className="subscriptions-brand">
          <div className="subscriptions-logo">
            M
          </div>

          <h2>Monetra</h2>
        </div>

        <nav className="subscriptions-nav">

          <Link
            to="/dashboard"
            className="subscriptions-nav-item"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/subscriptions"
            className="subscriptions-nav-item active"
          >
            <span>▣</span>
            Subscriptions
          </Link>

          <Link
            to="/analytics"
            className="subscriptions-nav-item"
          >
            <span>◔</span>
            Analytics
          </Link>

          <Link
            to="/settings"
            className="subscriptions-nav-item"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <Link
          to="/"
          className="subscriptions-logout"
        >
          ↪ Log Out
        </Link>

      </aside>


      {/* =========================
          MAIN
      ========================= */}

      <main className="subscriptions-main">

        {/* HEADER */}

        <header className="subscriptions-header">

          <div>
            <span className="page-eyebrow">
              YOUR MONEY
            </span>

            <h1>
              Your Subscriptions
            </h1>

            <p>
              Keep every recurring expense
              organized in one place.
            </p>
          </div>

          <div className="subscriptions-header-stat">

            <span>
              Monthly spending
            </span>

            <strong>
              ₹
              {monthlyTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </header>


        {/* CONTROLS */}

        <section className="subscriptions-controls">

          <div className="subscription-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <div className="filter-buttons">

            {[
              "All",
              "Monthly",
              "Yearly",
              "Active",
              "Paused",
              "Entertainment",
              "Productivity",
              "Education",
              "Others",
            ].map((item) => (

              <button
                key={item}
                className={
                  filter === item
                    ? "filter-btn active"
                    : "filter-btn"
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>

            ))}

          </div>


          <div className="view-toggle">

            <button
              className={
                view === "cards"
                  ? "view-btn active"
                  : "view-btn"
              }
              onClick={() =>
                setView("cards")
              }
            >
              ▦
            </button>

            <button
              className={
                view === "table"
                  ? "view-btn active"
                  : "view-btn"
              }
              onClick={() =>
                setView("table")
              }
            >
              ☷
            </button>

          </div>

        </section>


        {/* ADD BUTTON */}

        <div className="subscriptions-add-wrapper">

          <button
            className="subscriptions-add-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            + Add Subscription
          </button>

        </div>


        {/* CONTENT */}

        {loading ? (

          <div className="subscriptions-empty">
            <h3>
              Loading subscriptions...
            </h3>
          </div>

        ) : filteredSubscriptions.length ===
          0 ? (

          <div className="subscriptions-empty">

            <div className="empty-icon">
              ◇
            </div>

            <h3>
              No subscriptions found
            </h3>

            <p>
              Try changing your search
              or filters, or add a new
              subscription.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              + Add Subscription
            </button>

          </div>

        ) : view === "cards" ? (

          /* =========================
             CARD VIEW
          ========================= */

          <section className="subscription-card-grid">

            {filteredSubscriptions.map(
              (subscription) => (

                <article
                  className="subscription-card"
                  key={subscription.id}
                >

                  <div className="subscription-card-top">

                    <div className="subscription-logo">
                      {subscription.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <span
                      className={
                        subscription.status ===
                        "Paused"
                          ? "status paused"
                          : "status active"
                      }
                    >
                      {subscription.status ||
                        "Active"}
                    </span>

                  </div>


                  <div className="subscription-card-title">

                    <h2>
                      {subscription.name}
                    </h2>

                    <span>
                      {subscription.category ||
                        "Others"}
                    </span>

                  </div>


                  <div className="subscription-card-price">

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
                      /{" "}
                      {subscription.billing ===
                      "Yearly"
                        ? "year"
                        : "month"}
                    </span>

                  </div>


                  <div className="subscription-card-details">

                    <div>
                      <span>
                        Renewal
                      </span>

                      <strong>
                        {formatDate(
                          subscription.renewalDate
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {subscription.paymentMethod ||
                          "Not set"}
                      </strong>
                    </div>

                  </div>


                  <div className="subscription-card-actions">

                    <button
                      onClick={() =>
                        handleEdit(
                          subscription.id
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleToggleStatus(
                          subscription
                        )
                      }
                    >
                      {subscription.status ===
                      "Paused"
                        ? "Resume"
                        : "Pause"}
                    </button>

                    <button
                      className="delete-action"
                      onClick={() =>
                        handleDelete(
                          subscription.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              )
            )}

          </section>

        ) : (

          /* =========================
             TABLE VIEW
          ========================= */

          <section className="subscription-table-wrapper">

            <table className="subscription-table">

              <thead>
                <tr>
                  <th>Subscription</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Renewal</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredSubscriptions.map(
                  (subscription) => (

                    <tr
                      key={
                        subscription.id
                      }
                    >

                      <td>

                        <div className="table-subscription">

                          <div className="table-logo">
                            {subscription.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {subscription.name}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {subscription.category ||
                          "Others"}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            subscription.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <small>
                          /
                          {subscription.billing ===
                          "Yearly"
                            ? "year"
                            : "month"}
                        </small>
                      </td>

                      <td>
                        {formatDate(
                          subscription.renewalDate
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            subscription.status ===
                            "Paused"
                              ? "status paused"
                              : "status active"
                          }
                        >
                          {subscription.status ||
                            "Active"}
                        </span>
                      </td>

                      <td>

                        <div className="table-actions">

                          <button
                            onClick={() =>
                              handleEdit(
                                subscription.id
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

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </section>

        )}

      </main>

    </div>
  );
}

export default Subscriptions;