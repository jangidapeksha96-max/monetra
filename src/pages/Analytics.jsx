import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import "../styles/Analytics.css";

function Analytics() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const subscriptionsRef = collection(db, "subscriptions");

    const q = query(
      subscriptionsRef,
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setSubscriptions(data);
    });

    return () => unsubscribe();
  }, []);

  const monthlyTotal = useMemo(() => {
    return subscriptions.reduce((total, item) => {
      const price = Number(item.price || 0);

      if (item.billing === "Monthly") {
        return total + price;
      }

      if (item.billing === "Yearly") {
        return total + price / 12;
      }

      return total;
    }, 0);
  }, [subscriptions]);

  const yearlyTotal = useMemo(() => {
    return subscriptions.reduce((total, item) => {
      const price = Number(item.price || 0);

      if (item.billing === "Monthly") {
        return total + price * 12;
      }

      return total + price;
    }, 0);
  }, [subscriptions]);

  const averageCost =
    subscriptions.length > 0
      ? monthlyTotal / subscriptions.length
      : 0;

  const categories = [
    {
      name: "Entertainment",
      color: "brown",
    },
    {
      name: "Productivity",
      color: "beige",
    },
    {
      name: "Education",
      color: "blue",
    },
    {
      name: "Others",
      color: "sage",
    },
  ];

  const getCategoryAmount = (category) => {
    return subscriptions.reduce((total, item) => {
      const price = Number(item.price || 0);

      if (item.category !== category) return total;

      if (item.billing === "Monthly") {
        return total + price;
      }

      if (item.billing === "Yearly") {
        return total + price / 12;
      }

      return total;
    }, 0);
  };

  const getCategoryPercentage = (category) => {
    if (!monthlyTotal) return 0;

    return Math.round(
      (getCategoryAmount(category) / monthlyTotal) * 100
    );
  };

  const topSubscription = [...subscriptions].sort(
    (a, b) =>
      Number(b.price || 0) - Number(a.price || 0)
  )[0];

  const formatCurrency = (value) =>
    `₹${Math.round(value).toLocaleString("en-IN")}`;

  return (
    <div className="analytics-page">

      {/* SIDEBAR */}

      <aside className="analytics-sidebar">

        <div className="analytics-brand">
          <div className="analytics-logo">
            M
          </div>

          <div>
            <h1>Monetra</h1>
            <span>Smart subscription manager</span>
          </div>
        </div>

        <nav className="analytics-nav">

          <Link to="/dashboard">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/subscriptions">
            <span>▣</span>
            Subscriptions
          </Link>

          <Link
            to="/analytics"
            className="active"
          >
            <span>◔</span>
            Analytics
          </Link>

          <Link to="/settings">
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="analytics-sidebar-bottom">
          <p>
            Understand your spending.
            Make smarter choices.
          </p>

          <Link to="/">
            ↪ Log Out
          </Link>
        </div>

      </aside>

      {/* MAIN */}

      <main className="analytics-main">

        <header className="analytics-header">

          <div>
            <span className="analytics-eyebrow">
              MONETRA ANALYTICS
            </span>

            <h2>
              Your spending,
              <br />
              <span>made clearer.</span>
            </h2>

            <p>
              Understand where your money goes
              and find opportunities to save.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="analytics-back-btn"
          >
            ← Dashboard
          </Link>

        </header>

        {/* STATS */}

        <section className="analytics-stats">

          <div className="analytics-stat-card">
            <span>Monthly Total</span>

            <h3>
              {formatCurrency(monthlyTotal)}
            </h3>

            <small>
              Estimated monthly spending
            </small>
          </div>

          <div className="analytics-stat-card">
            <span>Yearly Total</span>

            <h3>
              {formatCurrency(yearlyTotal)}
            </h3>

            <small>
              Estimated annual spending
            </small>
          </div>

          <div className="analytics-stat-card">
            <span>Average Subscription</span>

            <h3>
              {formatCurrency(averageCost)}
            </h3>

            <small>
              Per active subscription
            </small>
          </div>

          <div className="analytics-stat-card highlight">
            <span>Total Subscriptions</span>

            <h3>
              {subscriptions.length}
            </h3>

            <small>
              Currently tracked
            </small>
          </div>

        </section>

        {/* MAIN ANALYTICS GRID */}

        <section className="analytics-grid">

          {/* CATEGORY */}

          <div className="analytics-card category-card">

            <div className="analytics-card-heading">
              <div>
                <span>SPENDING</span>
                <h3>Where your money goes</h3>
              </div>
            </div>

            <div className="category-chart">

              <div
                className="analytics-donut"
                style={{
                  background: `conic-gradient(
                    #8F5B34 0% ${getCategoryPercentage(
                      "Entertainment"
                    )}%,
                    #DAB692 ${getCategoryPercentage(
                      "Entertainment"
                    )}% ${getCategoryPercentage(
                      "Entertainment"
                    ) +
                      getCategoryPercentage(
                        "Productivity"
                      )}%,
                    #8A9EA7 ${
                      getCategoryPercentage(
                        "Entertainment"
                      ) +
                      getCategoryPercentage(
                        "Productivity"
                      )
                    }% ${
                      getCategoryPercentage(
                        "Entertainment"
                      ) +
                      getCategoryPercentage(
                        "Productivity"
                      ) +
                      getCategoryPercentage(
                        "Education"
                      )
                    }%,
                    #A8A18E ${
                      getCategoryPercentage(
                        "Entertainment"
                      ) +
                      getCategoryPercentage(
                        "Productivity"
                      ) +
                      getCategoryPercentage(
                        "Education"
                      )
                    }% 100%
                  )`,
                }}
              >
                <div className="donut-center">
                  <strong>
                    {formatCurrency(monthlyTotal)}
                  </strong>

                  <span>monthly</span>
                </div>
              </div>

              <div className="category-list">

                {categories.map((category) => (
                  <div
                    className="category-row"
                    key={category.name}
                  >
                    <div>
                      <span
                        className={`category-color ${category.color}`}
                      />

                      <span>
                        {category.name}
                      </span>
                    </div>

                    <strong>
                      {getCategoryPercentage(
                        category.name
                      )}
                      %
                    </strong>
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* INSIGHTS */}

          <div className="analytics-card insights-card">

            <div className="analytics-card-heading">
              <div>
                <span>SMART INSIGHTS</span>
                <h3>A little insight</h3>
              </div>

              <div className="insight-symbol">
                ✦
              </div>
            </div>

            <div className="insight-main">

              {subscriptions.length === 0 ? (
                <>
                  <h4>
                    Your insights are waiting.
                  </h4>

                  <p>
                    Add subscriptions to your
                    dashboard and Monetra will
                    start analyzing your spending.
                  </p>
                </>
              ) : (
                <>
                  <h4>
                    You're spending{" "}
                    {formatCurrency(monthlyTotal)}
                    {" "}each month.
                  </h4>

                  <p>
                    {topSubscription
                      ? `${topSubscription.name} is currently your highest-cost subscription.`
                      : "Keep adding your subscriptions to get more insights."}
                  </p>
                </>
              )}

            </div>

            <div className="insight-tip">
              <span>💡</span>

              <p>
                Review subscriptions you rarely
                use. Small cancellations can create
                meaningful savings over time.
              </p>
            </div>

          </div>

        </section>

        {/* CATEGORY BREAKDOWN */}

        <section className="analytics-card breakdown-card">

          <div className="analytics-card-heading">
            <div>
              <span>BREAKDOWN</span>
              <h3>Category spending</h3>
            </div>
          </div>

          <div className="breakdown-bars">

            {categories.map((category) => {
              const percentage =
                getCategoryPercentage(
                  category.name
                );

              return (
                <div
                  className="breakdown-bar-row"
                  key={category.name}
                >

                  <div className="breakdown-bar-label">

                    <span>
                      {category.name}
                    </span>

                    <strong>
                      {formatCurrency(
                        getCategoryAmount(
                          category.name
                        )
                      )}
                    </strong>

                  </div>

                  <div className="bar-track">

                    <div
                      className={`bar-fill ${category.color}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* RENEWALS */}

        <section className="analytics-card renewal-card">

          <div className="analytics-card-heading">

            <div>
              <span>UPCOMING</span>
              <h3>Upcoming renewals</h3>
            </div>

            <Link to="/subscriptions">
              Manage →
            </Link>

          </div>

          {subscriptions.length === 0 ? (
            <div className="analytics-empty">
              No subscriptions added yet.
            </div>
          ) : (
            <div className="renewal-list">

              {[...subscriptions]
                .filter(
                  (item) => item.renewalDate
                )
                .sort(
                  (a, b) =>
                    new Date(a.renewalDate) -
                    new Date(b.renewalDate)
                )
                .slice(0, 4)
                .map((item) => (

                  <div
                    className="renewal-item"
                    key={item.id}
                  >

                    <div className="renewal-logo">
                      {item.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        Renews on{" "}
                        {new Date(
                          `${item.renewalDate}T00:00:00`
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(
                        Number(item.price || 0)
                      )}
                    </strong>

                  </div>

                ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Analytics;