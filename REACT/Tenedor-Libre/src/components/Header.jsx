import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logo } from "@api/data";
import "@styles/index.scss";

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <header className="site-header" aria-label="Barra principal">
      <div className="container nav">
        <a className="brand" href="/" aria-label="Volver al inicio">
          <img src={logo} alt="Logo de Tenedor Libre" className="brand-logo" />
          <span className="brand-text">Tenedor Libre</span>
        </a>

        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="site-nav"
        >
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
        </button>

        <nav
          id="site-nav"
          className={`links ${open ? "open" : ""}`}
          aria-label="Secciones"
        >
          <a href="/">Inicio</a>
          <a href="/tienda">Tienda</a>
          <button onClick={() => scrollToSection("resenas")} className="link-button">
            Reseñas
          </button>
          <button onClick={() => scrollToSection("contacto")} className="link-button">
            Contacto
          </button>
          <a href="/login?mode=signup" id="nav-register">
            Registrarse
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
