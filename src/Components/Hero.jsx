import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="about">

      <div className="hero-container">

        {/* LEFT */}
        <div className="hero-content">

          <div className="hero-eyebrow">
            <span></span>
            SMART SUBSCRIPTION MANAGEMENT
          </div>

          <h1>
            Manage Every
            <br />
            Subscription,
            <span> Effortlessly.</span>
          </h1>

          <p>
            Track, manage and get reminded of all
            your subscriptions in one calm,
            organized place.
          </p>

          <div className="hero-buttons">

            <Link
              to="/signup"
              className="primary-btn"
            >
              Get Started
              <span>→</span>
            </Link>

            <a
              href="#how-it-works"
              className="secondary-btn"
            >
              Learn More
              <span>→</span>
            </a>

          </div>

          <div className="hero-trust">

            <div className="trust-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <p>
              Everything you need to stay in control
            </p>

          </div>

        </div>


        {/* RIGHT */}
        <div className="hero-visual">

          <div className="hero-blue-shape"></div>

          <div className="hero-peach-shape"></div>

          <div className="hero-dots">
            • • •<br />
            • • •<br />
            • • •
          </div>

          <div className="hero-dashboard-card">

            <div className="dashboard-card-header">
              <span>Monthly Overview</span>

              <span className="growth">
                ↑ 12%
              </span>
            </div>

            <h2>
              ₹2,537
            </h2>

            <p className="total-label">
              Total Spent
            </p>


            <div className="hero-subscription">

              <div className="subscription-left">
                <div className="subscription-icon netflix">
                  N
                </div>

                <span>Netflix</span>
              </div>

              <strong>₹649</strong>

            </div>


            <div className="hero-subscription">

              <div className="subscription-left">
                <div className="subscription-icon spotify">
                  S
                </div>

                <span>Spotify</span>
              </div>

              <strong>₹119</strong>

            </div>


            <div className="hero-subscription">

              <div className="subscription-left">
                <div className="subscription-icon prime">
                  P
                </div>

                <span>Amazon Prime</span>
              </div>

              <strong>₹299</strong>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;