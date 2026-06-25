import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Button from "@components/Button";
import "@styles/login.scss";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    usuario: "",
    contrasenia: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarContrasenia = (pass) => pass.length >= 6;

  const resetForm = () =>
    setForm({ nombre: "", apellido: "", telefono: "", email: "", usuario: "", contrasenia: "" });

  const getRedirect = () => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/";
  };

  /**
   * Persiste las credenciales en localStorage y actualiza el contexto global
   * @param {string} usuario - Nombre de usuario
   * @param {string} [nombre=''] - Nombre completo opcional
   */
  const saveAuth = (usuario, nombre = "") => {
    try {
      const data = { username: usuario, name: nombre || usuario, ts: Date.now() };
      localStorage.setItem("cmf_auth", JSON.stringify(data));
      setAuth(data);
      window.dispatchEvent(new CustomEvent("cmf:auth-changed"));
    } catch {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (modo === "registro") {
      const { nombre, apellido, telefono, email, usuario, contrasenia } = form;

      if (!nombre || !apellido || !telefono || !email || !usuario || !contrasenia) {
        setError("Completa todos los campos.");
        return;
      }
      if (!validarEmail(email)) {
        setError("Email inválido.");
        return;
      }
      if (!validarContrasenia(contrasenia)) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      saveAuth(usuario, nombre + " " + apellido);
      setMensaje("¡Te registraste correctamente!");
      resetForm();
      setTimeout(() => navigate(getRedirect()), 1500);
      return;
    }

    // MODO LOGIN
    if (!form.usuario || !form.contrasenia) {
      setError("Completá usuario y contraseña.");
      return;
    }

    if (!validarContrasenia(form.contrasenia)) {
      setError("Contraseña incorrecta o inválida.");
      return;
    }

    saveAuth(form.usuario);
    setMensaje(`¡Bienvenido ${form.usuario}!`);
    resetForm();
    setTimeout(() => navigate(getRedirect()), 1500);
  };

  return (
    <section className="login-container">
      <h2>{modo === "login" ? "Iniciar sesión" : "Registrarme"}</h2>

      <div className="tabs">
        <button
          className={modo === "login" ? "active" : ""}
          onClick={() => { setModo("login"); setError(""); setMensaje(""); }}
        >
          Iniciar sesión
        </button>
        <button
          className={modo === "registro" ? "active" : ""}
          onClick={() => { setModo("registro"); setError(""); setMensaje(""); }}
        >
          Registrarme
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {modo === "registro" && (
          <>
            <div className="grid-2">
              <div className="form-row">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                  value={form.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                placeholder="+54 9 ..."
                autoComplete="tel"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Tu@email.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="form-row">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            name="usuario"
            placeholder="Tu usuario"
            autoComplete="username"
            value={form.usuario}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="contrasenia">Contraseña</label>
          <input
            id="contrasenia"
            type="password"
            name="contrasenia"
            placeholder="Mínimo 6 caracteres"
            autoComplete={modo === "registro" ? "new-password" : "current-password"}
            value={form.contrasenia}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        {mensaje && <p className="form-ok">{mensaje}</p>}

        <Button type="submit">Continuar</Button>
      </form>
    </section>
  );
};

export default Login;
