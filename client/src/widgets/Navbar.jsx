import { useState } from "react";
import { Link } from "react-router";
import "../styles/navbar.css";

export default function CustomNavbar({ user, logoutHandler }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Падающие снежинки */}
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>

        <Link to="/" className="navbar-brand">
          🎄 📚 Книжный уголок 🎄
        </Link>
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <ul className={`navbar-nav ${isOpen ? "active" : ""}`}>
          {!user && (
            <>
              <li>
                <Link to="/registration" className="nav-link">
                  🎁 Зарегистрироваться
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-link">
                  🔔 Войти
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link to="/favorites" className="nav-link">
                  ⭐ Избранное
                </Link>
              </li>
              <li>
                <a className="nav-link" onClick={logoutHandler}>
                  🎅 Выйти
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
