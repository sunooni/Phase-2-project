import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/navbar.css";

export default function CustomNavbar({ user, logoutHandler }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("lang", lng);
    } catch (e) {}
    if (typeof document !== "undefined") document.documentElement.lang = lng;
  };

  const handleBurgerClick = () => {
    // Проверяем, является ли устройство мобильным (ширина экрана меньше 768px)
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      alert("Поверните телефон горизонтально");
    } else {
      setIsOpen(!isOpen);
    }
  };

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
          {t("navbar.brand")}
        </Link>
        <div className="lang-switcher">
          <button
            className={`lang-btn ${i18n.language === "ru" ? "active" : ""}`}
            onClick={() => changeLang("ru")}
            aria-label="Русский"
          >
            RU
          </button>
          <button
            className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
            onClick={() => changeLang("en")}
            aria-label="English"
          >
            EN
          </button>
        </div>
        <button
          className="navbar-toggle"
          onClick={handleBurgerClick}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <ul className={`navbar-nav ${isOpen ? "active" : ""}`}>
          {!user && (
            <>
              <li>
                <Link to="/registration" className="nav-link">
                  {t("navbar.register")}
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-link">
                  {t("navbar.login")}
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link to="/favorites" className="nav-link">
                  {t("navbar.favorites")}
                </Link>
              </li>
              <li>
                <a className="nav-link" onClick={logoutHandler}>
                  {t("navbar.logout")}
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
