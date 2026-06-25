import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * Provee el estado de autenticación global a todos los componentes hijos
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cmf_auth")); }
    catch { return null; }
  });

  useEffect(() => {
    /**
     * Sincroniza el estado de auth cuando cambia en otro componente
     */
    const sync = () => {
      try { setAuth(JSON.parse(localStorage.getItem("cmf_auth"))); }
      catch { setAuth(null); }
    };
    window.addEventListener("cmf:auth-changed", sync);
    return () => window.removeEventListener("cmf:auth-changed", sync);
  }, []);

  /**
   * Cierra la sesión del usuario: limpia localStorage y emite el evento global
   */
  const logout = () => {
    localStorage.removeItem("cmf_auth");
    setAuth(null);
    window.dispatchEvent(new CustomEvent("cmf:auth-changed"));
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación
 * @returns {{ auth: Object|null, setAuth: Function, logout: Function }}
 */
const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
