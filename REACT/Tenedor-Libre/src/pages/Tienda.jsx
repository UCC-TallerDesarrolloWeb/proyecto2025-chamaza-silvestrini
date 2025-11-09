import { useState, useEffect } from "react";
import { api } from "@api/mockService";
import "@styles/tienda.scss";

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("tl_cart");
    return saved ? JSON.parse(saved) : {};
  });
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await api.getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    localStorage.setItem("tl_cart", JSON.stringify(carrito));
  }, [carrito]);

  const agregar = (id) => {
    setCarrito((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const vaciar = () => setCarrito({});

  const finalizarCompra = () => {
    if (Object.keys(carrito).length === 0) {
      alert("Tu carrito esta vacio");
      return;
    }
    alert("¡Pedido enviado con exito!");
    setCarrito({});
    setMostrarCarrito(false);
  };

  // Total
  const total = Object.entries(carrito).reduce((acc, [id, qty]) => {
    const prod = productos.find((p) => p.id === id);
    return acc + (prod?.price || 0) * qty;
  }, 0);

  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0);

  return (
    <section className="tienda">
      <div className="tienda-header">
        <h2>Tienda Online 🛒</h2>
        <button
          className="btn carrito-btn"
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          🧺 Carrito
          <span className="cart-count">{totalItems}</span>
        </button>
      </div>
      {mostrarCarrito && (
      <div className="carrito">
      <div className="carrito-contenido">
      <button className="btn cerrar" onClick={() => setMostrarCarrito(false)}>
        Cerrar
      </button>

      <h3>Carrito ({totalItems} items)</h3>

      {Object.keys(carrito).length > 0 ? (
        <>
          <ul>
            {Object.entries(carrito).map(([id, qty]) => {
              const prod = productos.find((p) => p.id === id);
              return (
                <li key={id}>
                  {prod?.name} × {qty}
                </li>
              );
            })}
          </ul>

          <p>
            <b>Total:</b> ${total.toLocaleString("es-AR")}
          </p>

          <div className="cart-buttons">
            <button className="btn danger" onClick={vaciar}>
              Vaciar carrito
            </button>
            <button className="btn primary" onClick={finalizarCompra}>
              Finalizar compra
            </button>
          </div>
        </>
      ) : (
        <p className="muted">Tu carrito está vacío 🛍️</p>
      )}
    </div>
  </div>
)}


      <div className="shop-grid">
        {productos.map((p) => (
          <div key={p.id} className="card">
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">${p.price.toLocaleString("es-AR")}</p>

            {p.tags && (
              <div className="tags">
                {p.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="meta-row">
              <button className="btn small" onClick={() => agregar(p.id)}>
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tienda;