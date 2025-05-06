import React from 'react';
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Icons for contact and social media

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-4">
      <div className="container">
        <div className="row">
          {/* Contact Information */}
          <div className="col-md-4 mb-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <FaEnvelope className="me-2" />
                <a href="mailto:support@jiraniconnect.com" className="text-light text-decoration-none">
                  support@jiraniconnect.com
                </a>
              </li>
              <li>
                <FaPhone className="me-2" />
                <a href="tel:+254712345678" className="text-light text-decoration-none">
                  +254 114 532 154
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  About Us
                </a>
              </li>
              
              <li>
                <a href="/register" className="text-light text-decoration-none">
                  Register
                </a>
              </li>
              <li>
                <a href="/login" className="text-light text-decoration-none">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4 mb-4">
            <h5>Follow Us</h5>
            <ul className="list-unstyled d-flex gap-3">
              <li>
                <a href="https://facebook.com" className="text-light text-decoration-none">
                  <FaFacebook size={24} />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-light text-decoration-none">
                  <FaTwitter size={24} />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-light text-decoration-none">
                  <FaInstagram size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="text-center mt-3">
          <p className="mb-0">© 2025 JiraniConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;