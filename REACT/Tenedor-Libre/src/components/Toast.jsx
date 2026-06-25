import { useEffect } from "react";
import "@styles/index.scss";

/**
 * Componente genérico de notificación toast.
 * @param {string}  message  - Texto a mostrar
 * @param {'success'|'error'|'info'} type - Variante visual
 * @param {Function} onClose  - Callback al cerrar
 */
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-popup toast-${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Toast;
