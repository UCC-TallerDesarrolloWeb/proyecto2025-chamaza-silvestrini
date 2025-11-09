import "@styles/index.scss";

const Footer = () => {
  return (
    <footer className="site-footer" aria-label="Pie de pagina">
      <div className="container">
        <small>©️ <span class="mono">Tenedor Libre</span>. Buffet en casa.</small>
        <a className="back-to-top" href="#hero" aria-label="Volver arriba">
        </a>
      </div>
    </footer>
  );
};

export default Footer;
