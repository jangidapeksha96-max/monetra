import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="monetra-navbar">

      <div className="monetra-navbar-inner">

        <a href="/" className="monetra-logo">
          <img
            src={logo}
            alt="Monetra Logo"
          />

          <span>Monetra</span>
        </a>

        <div className="monetra-nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#pricing">
            Pricing
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <a
          href="/login"
          className="monetra-login-btn"
        >
          Login
        </a>

      </div>

    </nav>
  );
}

export default Navbar;