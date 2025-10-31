import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";


const Navbar = () => {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Smart NotesHub</Link>
      </div>

      {/* Hamburger Icon (only visible on small screens) */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Navbar Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        {!token && <Link to="/signup">Signup</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && <Link to="/dashboard">Dashboard</Link>}
        {token && <Link to="/notes">Notes</Link>}
        {token && <Link to="/add-note">Add Note</Link>}

        {token && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
