import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { logo } from "@api/data";
import "@styles/index.scss";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();

  /**
   * Alterna la visibilidad del menú hamburguesa en mobile
   */
  const toggleMenu = () => setOpen(!open);

  /**
   * Navega a una sección de la página usando scroll suave
   * @param {string} id - ID del elemento destino
   */
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

  /**
   * Cierra la sesión activa y redirige al inicio
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const firstName = auth
    ? (auth.name || auth.username || "Usuario").split(" ")[0]
    : null;

  return (
    <header className="site-header" aria-label="Barra principal">
      <div className="container nav">
        <a className="brand" href="/" aria-label="Volver al inicio">
          <img src={logo} alt="Logo de Tenedor Libre" className="brand-logo" />
          <h1 className="brand-text">Tenedor Libre</h1>
        </a>

        <button
          className={`nav-toggle${open ? " open" : ""}`}
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
          {auth && <span className="nav-greeting">Hola, {firstName}</span>}
          <a href="/recetas" onClick={() => setOpen(false)}>Categorías</a>
          <button onClick={() => scrollToSection("mapa")} className="link-button">Mapa</button>
          <a href="/tienda" onClick={() => setOpen(false)}>Tienda</a>
          <button onClick={() => scrollToSection("resenas")} className="link-button">
            Reseñas
          </button>
          <button onClick={() => scrollToSection("contacto")} className="link-button">
            Contacto
          </button>

          {auth ? (
            <button className="link-button nav-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <a href="/login?mode=signup" id="nav-register" onClick={() => setOpen(false)}>
              Registrarse
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
