/**
 * Botón genérico reutilizable con variantes de estilo
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {'primary'|'secondary'|'danger'} [props.variant='primary'] - Variante visual
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Tipo HTML del botón
 * @param {Function} [props.onClick] - Manejador de click
 * @param {string} [props.className=''] - Clases adicionales
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado
 * @returns {JSX.Element}
 */
const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
  ...rest
}) => {
  const variantClass =
    variant === "secondary" ? " secondary"
    : variant === "danger" ? " danger"
    : "";

  return (
    <button
      type={type}
      className={`btn${variantClass}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
