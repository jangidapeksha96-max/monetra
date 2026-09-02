import "../styles/Footer.css";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <a
            href="/"
            className="footer-logo"
          >

            <img
              src={logo}
              alt="Monetra Logo"
            />

            <span>
              Monetra
            </span>

          </a>

          <p>
            Manage subscriptions.
            <br />
            Save money. Stress less.
          </p>

        </div>


        <div className="footer-column">

          <h4>
            Product
          </h4>

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#pricing">
            Pricing
          </a>

        </div>


        <div className="footer-column">

          <h4>
            Company
          </h4>

          <a href="#about">
            About Us
          </a>

          <a href="#">
            Blog
          </a>

          <a href="#">
            Contact
          </a>

        </div>


        <div className="footer-column">

          <h4>
            Legal
          </h4>

          <a href="#">
            Privacy Policy
          </a>

          <a href="#">
            Terms of Service
          </a>

        </div>


        <div className="footer-column">

          <h4>
            Follow Us
          </h4>

          <div className="footer-social">

            <a href="#" aria-label="Twitter">
              X
            </a>

            <a href="#" aria-label="LinkedIn">
              in
            </a>

            <a href="#" aria-label="Instagram">
              ◎
            </a>

          </div>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 Monetra. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;