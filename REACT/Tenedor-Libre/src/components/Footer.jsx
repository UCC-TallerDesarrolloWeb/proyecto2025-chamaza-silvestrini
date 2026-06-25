import { Link } from "react-router-dom";
import "@styles/index.scss";

const Footer = () => {
  return (
    <footer className="site-footer" aria-label="Pie de página">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-text">Tenedor Libre</span>
            <p>Buffet en casa</p>
          </div>
          <nav className="footer-nav" aria-label="Links del footer">
            <Link to="/recetas">Categorías</Link>
            <Link to="/tienda">Tienda</Link>
            <a href="/#mapa">Mapa</a>
            <a href="/#resenas">Reseñas</a>
            <a href="/#contacto">Contacto</a>
            <button
                className="back-to-top link-button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Volver arriba"
              >↑ Arriba</button>
          </nav>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <small>© 2025 <span className="mono">Tenedor Libre</span>. Buffet en casa.</small>
          <div className="footer-legal">
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/condiciones">Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
