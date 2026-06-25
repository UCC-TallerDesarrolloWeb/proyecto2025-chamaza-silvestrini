import "@styles/index.scss";

const Privacidad = () => (
  <main className="section">
    <div className="container narrow">
      <h1>Política de Privacidad</h1>
      <p className="muted">Última actualización: junio 2025</p>

      <h2>¿Qué datos guardamos?</h2>
      <p>
        Tenedor Libre almacena únicamente los datos que vos ingresás: nombre de usuario,
        nombre completo y dirección de email al momento del registro. Estos datos se guardan
        de forma local en tu dispositivo (<em>localStorage</em>) y no se envían a ningún servidor externo.
      </p>

      <h2>¿Para qué los usamos?</h2>
      <p>
        Los datos se usan exclusivamente para identificarte dentro del sitio: mostrar tu nombre
        en el saludo del encabezado, asociar tus reseñas a tu cuenta y habilitarte la compra en la tienda.
      </p>

      <h2>¿Los compartimos con terceros?</h2>
      <p>
        No. No compartimos, vendemos ni cedemos tus datos personales a ninguna empresa, organismo
        o persona externa.
      </p>

      <h2>¿Podés eliminar tus datos?</h2>
      <p>
        Sí. Podés cerrar sesión en cualquier momento desde el encabezado del sitio; eso elimina
        tu sesión activa. Para borrar todos los datos guardados, podés limpiar el almacenamiento
        local de tu navegador desde la configuración de privacidad.
      </p>

      <h2>Cookies</h2>
      <p>
        Este sitio no utiliza cookies de seguimiento ni publicidad. Solo usa{" "}
        <em>localStorage</em> y <em>sessionStorage</em> del navegador para funcionar correctamente.
      </p>
    </div>
  </main>
);

export default Privacidad;
