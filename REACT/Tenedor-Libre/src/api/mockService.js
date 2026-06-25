const BASE_URL = "http://localhost:3001";

/**
 * Obtiene todos los productos desde el servidor json-server.
 * @returns {Promise<Array>} Lista de productos
 */
const getProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

/**
 * Agrega un nuevo producto al servidor.
 * @param {Object} nuevo - Datos del producto a agregar
 * @returns {Promise<Object>} Producto creado con id asignado
 */
const addProducto = async (nuevo) => {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  if (!res.ok) throw new Error("Error al agregar producto");
  return res.json();
};

/**
 * Actualiza un producto existente por su id.
 * @param {string} id - Id del producto a actualizar
 * @param {Object} cambios - Campos a modificar
 * @returns {Promise<Object>} Producto actualizado
 */
const updateProducto = async (id, cambios) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
};

/**
 * Elimina un producto del servidor por su id.
 * @param {string} id - Id del producto a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
const deleteProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return { success: true, id };
};

export const api = { getProductos, addProducto, updateProducto, deleteProducto };
