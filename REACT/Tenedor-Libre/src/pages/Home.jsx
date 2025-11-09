import { useState, useEffect } from "react";
import "@styles/index.scss";

const Home = () => {
  // Estado reseñas //
  const [reseñas, setReseñas] = useState(() => {
    const saved = localStorage.getItem("tl_reviews");
    return saved ? JSON.parse(saved) : [];
  });
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [puntaje, setPuntaje] = useState(0);

  // Guardar reseñas en localStorage //
  useEffect(() => {
    localStorage.setItem("tl_reviews", JSON.stringify(reseñas));
  }, [reseñas]);

  // Seleccionar estrellas
  const handleStarClick = (v) => setPuntaje(v);

  // Enviar reseña //
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !comentario || puntaje === 0) return;

    const nueva = {
      id: Date.now(),
      nombre,
      comentario,
      puntaje,
    };

    setReseñas([nueva, ...reseñas]);
    setNombre("");
    setComentario("");
    setPuntaje(0);
  };

  // Promedio
  const promedio =
    reseñas.length > 0
      ? (reseñas.reduce((a, b) => a + b.puntaje, 0) / reseñas.length).toFixed(1)
      : "0.0";

  return (
    <main>
      <section
        id="hero"
        className="hero"
      >
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
            <a href="#mapa" className="btn secondary">
              Ver mapa
            </a>
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
                <form onSubmit={handleSubmit}>
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />

                  <label>Comentario</label>
                  <textarea
                    rows="4"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="¿Cómo fue tu experiencia?"
                    required
                  ></textarea>

                  <label>Puntaje</label>
                  <div className="stars" aria-label="Seleccionar puntaje">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleStarClick(v)}
                        className={puntaje >= v ? "active" : ""}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <button className="btn" type="submit">
                    Publicar reseña
                  </button>
                </form>
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
                    <p className="muted">Aún no hay reseñas.</p>
                  ) : (
                    reseñas.map((r) => (
                      <li key={r.id}>
                        <strong>{r.nombre}</strong> — {"⭐".repeat(r.puntaje)}
                        <p>{r.comentario}</p>
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
            <input type="email" placeholder="Tu@email.com" required />
            <textarea
              rows="3"
              placeholder="Contanos cómo te gustaría participar"
            ></textarea>
            <button className="btn" type="submit">
              Enviar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
