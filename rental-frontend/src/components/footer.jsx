function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <h2>
            🏠 Rental<span>Hub</span>
          </h2>

          <p>
            Find comfortable and affordable accommodation
            in your preferred location.
          </p>

        </div>

        <div className="footer-links">

          <h3>Quick Links</h3>

          <a href="/">Home</a>

          <a href="/properties">
            Find Accommodation
          </a>

          <a href="/list-property">
            List Your Property
          </a>

          <a href="/about">
            About Us
          </a>

        </div>

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>📧 info@rentalhub.ug</p>

          <p>📞 +256 700 000 000</p>

          <p>📍 Kampala, Uganda</p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 RentalHub. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;