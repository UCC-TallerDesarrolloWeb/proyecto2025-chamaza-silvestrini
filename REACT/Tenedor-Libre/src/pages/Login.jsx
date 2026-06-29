import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { api } from "@api/mockService";
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
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email" && value && !validarEmail(value)) {
      setError("Email inválido.");
    } else if (name === "contrasenia" && value && !validarContrasenia(value)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setError("");
    }
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
   * Persiste las credenciales en localStorage y actualiza el contexto global.
   * @method saveAuth
   * @param {string} usuario - Nombre de usuario
   * @param {string} nombre - Nombre completo del usuario
   */
  const saveAuth = (usuario, nombre = "") => {
    try {
      const data = { username: usuario, name: nombre || usuario, ts: Date.now() };
      localStorage.setItem("cmf_auth", JSON.stringify(data));
      setAuth(data);
      window.dispatchEvent(new CustomEvent("cmf:auth-changed"));
    } catch { /* localStorage no disponible */ }
  };

  /**
   * Maneja el envío del formulario: registra o inicia sesión según el modo activo.
   * En registro verifica que el usuario no exista y guarda el nuevo usuario.
   * En login busca el usuario y compara la contraseña antes de autenticar.
   * @method handleSubmit
   * @param {React.FormEvent} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const todosLosUsuarios = await api.getUsuarios();

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

        const yaExiste = todosLosUsuarios.some(
          (u) => u.username.toLowerCase() === usuario.toLowerCase()
        );
        if (yaExiste) {
          setError("Ese nombre de usuario ya está en uso. Elegí otro.");
          return;
        }

        await api.addUsuario({
          username: usuario,
          password: contrasenia,
          name: `${nombre} ${apellido}`,
          email,
        });

        saveAuth(usuario, `${nombre} ${apellido}`);
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

      const encontrado = todosLosUsuarios.find(
        (u) =>
          u.username.toLowerCase() === form.usuario.toLowerCase() &&
          u.password === form.contrasenia
      );

      if (!encontrado) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      saveAuth(encontrado.username, encontrado.name || encontrado.username);
      setMensaje(`¡Bienvenido, ${encontrado.name || encontrado.username}!`);
      resetForm();
      setTimeout(() => navigate(getRedirect()), 1500);

    } catch {
      setError("Error al conectar con el servidor. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
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

        {error && <p className="form-error" role="alert">{error}</p>}
        {mensaje && <p className="form-ok">{mensaje}</p>}

        <Button type="submit" disabled={cargando}>
          {cargando ? "Verificando..." : "Continuar"}
        </Button>
      </form>
    </section>
  );
};

export default Login;
