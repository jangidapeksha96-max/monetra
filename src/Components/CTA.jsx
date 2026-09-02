import { Link } from "react-router-dom";
import "../styles/CTA.css";

function CTA() {
  return (
    <section className="cta">

      <div className="cta-box">

        <div className="cta-decoration">
          ✦
        </div>

        <div className="cta-content">

          <span className="cta-label">
            TAKE CONTROL
          </span>

          <h2>
            Ready to Take Control
            <br />
            of Your Subscriptions?
          </h2>

          <p>
            Stop losing money on subscriptions
            you don't use. Start managing your
            spending smarter with Monetra.
          </p>

          <Link
            to="/signup"
            className="cta-btn"
          >
            Get Started Today
            <span>→</span>
          </Link>

        </div>

        <div className="cta-leaves">
          🌿
        </div>

      </div>

    </section>
  );
}

export default CTA;