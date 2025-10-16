import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/Green IQ Logo Without Text.png" alt="Green IQ Logo" height="40" className="me-2 wave" />
          <span className="fw-bold">Green IQ</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname.startsWith('/news') ? 'active' : ''}`} to="/news">Latest News</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;