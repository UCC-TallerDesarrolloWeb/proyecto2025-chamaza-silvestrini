import { useState } from "react";
import "@styles/login.scss";

const Login = () => {
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
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarContrasenia = (pass) => pass.length >= 6;

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
        setError("Email invalido.");
        return;
      }
      if (!validarContrasenia(contrasenia)) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      setMensaje("¡Te registraste correctamente! ");
      setForm({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        usuario: "",
        contrasenia: "",
      });
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

    setMensaje(`Bienvenido ${form.usuario}! 👋`);
    setForm({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      usuario: "",
      contrasenia: "",
    });
  };

  return (
    <section className="login-container">
      <h2>{modo === "login" ? "Iniciar sesión" : "Registrarme"}</h2>

      <div className="tabs">
        <button
          className={modo === "login" ? "active" : ""}
          onClick={() => setModo("login")}
        >
          Iniciar sesión
        </button>
        <button
          className={modo === "registro" ? "active" : ""}
          onClick={() => setModo("registro")}
        >
          Registrarme
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {modo === "registro" && (
          <>
            <div className="grid-2">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </>
        )}

        <input
          type="text"
          name="usuario"
          placeholder="Usuario"
          value={form.usuario}
          onChange={handleChange}
        />
        <input
          type="password"
          name="contrasenia"
          placeholder="Contraseña"
          value={form.contrasenia}
          onChange={handleChange}
        />

        {error && <p className="form-error">{error}</p>}
        {mensaje && <p className="form-ok">{mensaje}</p>}

        <button type="submit" className="btn primary">
          Continuar
        </button>
      </form>
    </section>
  );
};

export default Login;
