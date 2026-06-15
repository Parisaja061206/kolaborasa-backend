function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        <div className="footer-col">
          <h5>Support</h5>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety information</a></li>
            <li><a href="#">Cancellation options</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Community Blog</a></li>
            <li><a href="#">Terms of service</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Get in touch</a></li>
            <li><a href="#">Partnerships</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Social</h5>
          <div className="footer-socials">
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 Kolaborasa. All rights reserved.</p>
        <div className="footer-payments">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/120px-Visa_Inc._logo.svg.png" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png" alt="Mastercard" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png" alt="PayPal" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
