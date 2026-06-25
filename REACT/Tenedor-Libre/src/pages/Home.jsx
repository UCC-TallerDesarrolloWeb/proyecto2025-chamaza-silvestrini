import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Button from "@components/Button";
import "@styles/index.scss";

const Home = () => {
  const { auth } = useAuth();
  const nombre = auth ? (auth.name || auth.username || "") : "";

  const [reseñas, setReseñas] = useState(() => {
    const saved = localStorage.getItem("tl_reviews");
    return saved ? JSON.parse(saved) : [];
  });

  const [comentario, setComentario] = useState("");
  const [puntaje, setPuntaje] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('tl_reviews_v2')) {
      localStorage.removeItem('tl_reviews');
      localStorage.setItem('tl_reviews_v2', '1');
      setReseñas([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tl_reviews", JSON.stringify(reseñas));
  }, [reseñas]);

  const promedio = reseñas.length > 0
    ? (reseñas.reduce((a, b) => a + b.puntaje, 0) / reseñas.length).toFixed(1)
    : "0.0";

  /**
   * Actualiza el puntaje seleccionado al hacer clic en una estrella
   * @param {number} v - Valor de la estrella seleccionada (1–5)
   */
  const handleStarClick = (v) => setPuntaje(v);

  /**
   * Envía la reseña — requiere sesión activa
   * @param {Event} e - Evento de submit del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario || puntaje === 0) return;
    setReseñas([{ id: Date.now(), nombre: auth?.name || auth?.username || "Anónimo", comentario, puntaje }, ...reseñas]);
    setComentario("");
    setPuntaje(0);
    setHoveredStar(0);
  };

  return (
    <main>
      <section id="hero" className="hero">
        <div className="container">
          <span className="badge">Tenedor Libre — Buffet en casa</span>
          <h1 className="hero-title">
            Cocina con estilo, técnica y comunidad
          </h1>
          <p className="lead">
            Recetas de autor con <b>paso a paso</b>,{" "}
            <b>filtros inteligentes</b> y fotos editoriales.
            <br />
            Descubrí clases y ferias en el <b>mapa</b> y compartí tu
            experiencia con la comunidad.
          </p>
          <div className="cta">
            <a href="/recetas" className="btn">Explorar recetas</a>
            <a href="#mapa" className="btn secondary">Ver mapa</a>
          </div>
        </div>
      </section>

      <section id="acerca" className="section section-soft">
        <div className="container narrow">
          <h2>Nuestra cocina</h2>
          <p>
            Curamos técnicas, ingredientes y <b>sabores de temporada</b> con una
            mirada contemporánea. Unimos <b>recetas probadas</b>, productos
            recomendados y experiencias para que tu cocina<b> florezca</b> todos
            los días.
          </p>
        </div>
      </section>

      <section id="mapa" className="section section-soft">
        <div className="container">
          <h2>Mapa de restaurantes y ferias</h2>
          <p className="muted">
            Explorá los restaurantes, ferias y clases de cocina cerca tuyo 🍴.
          </p>
          <div className="map-embed">
            <iframe
              title="Restaurantes en Córdoba"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d13625.42640896016!2d-64.188776!3d-31.420083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1srestaurantes!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section id="resenas" className="section">
        <div className="container narrow">
          <h2>Reseñas de la comunidad</h2>
          <div className="reseñas-grid">
            <div className="reseña-form card">
              <div className="card-body">
                <h3>Dejá tu reseña</h3>

                {auth ? (
                  <form onSubmit={handleSubmit} className="form-grid">
                    <p className="review-author-badge">
                      Reseñando como <strong>{nombre.split(" ")[0]}</strong>
                    </p>

                    <div className="form-row">
                      <label htmlFor="r-comentario">Comentario</label>
                      <textarea
                        id="r-comentario"
                        rows="4"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="¿Cómo fue tu experiencia?"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <label htmlFor="r-puntaje">Puntaje</label>
                      <input type="hidden" id="r-puntaje" value={puntaje} readOnly />
                      <div className="stars" role="group" aria-label="Seleccionar puntaje">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => handleStarClick(v)}
                            onMouseEnter={() => setHoveredStar(v)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className={(hoveredStar || puntaje) >= v ? "active" : ""}
                            aria-label={`${v} estrella${v > 1 ? "s" : ""}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button type="submit">Publicar reseña</Button>
                  </form>
                ) : (
                  <div className="review-login-prompt">
                    <p className="muted">Para dejar una reseña necesitás iniciar sesión.</p>
                    <Link to="/login?redirect=/" className="btn">Iniciar sesión</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="reseña-list card">
              <div className="card-body">
                <div className="row-between">
                  <h3>Últimas reseñas</h3>
                  <span className="chip chip-gold">⭐ {promedio}</span>
                </div>
                <ul className="reviews-scroll">
                  {reseñas.length === 0 ? (
                    <li className="muted">Aún no hay reseñas… ¡sé el primero!</li>
                  ) : (
                    reseñas.map((r) => (
                      <li key={r.id}>
                        <p className="review-text">
                          <strong>{r.nombre}</strong><br />
                          <span className="review-stars">{"★".repeat(r.puntaje)}{"☆".repeat(5 - r.puntaje)}</span>
                        </p>
                        <p className="review-comment">{r.comentario}</p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="section section-soft">
        <div className="container narrow">
          <h2>Contacto</h2>
          <p className="muted">¿Sos chef, escuela o marca? Conversemos.</p>
          <form className="contact-form">
            <div className="form-row">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" type="email" placeholder="Tu@email.com" required />
            </div>
            <div className="form-row">
              <label htmlFor="c-mensaje">Mensaje</label>
              <textarea
                id="c-mensaje"
                rows="3"
                placeholder="Contanos cómo te gustaría participar"
              ></textarea>
            </div>
            <Button type="submit">Enviar</Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
