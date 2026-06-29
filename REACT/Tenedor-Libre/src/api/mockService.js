/**
 * @fileoverview Mock de servicio para productos y usuarios de la tienda
 * @description Lee datos desde db.json (servido como estático por Vite).
 *              Los usuarios nuevos se persisten en localStorage.
 *              Las operaciones de escritura de productos simulan el comportamiento sin persistir.
 * @module mockService
 */

const USERS_KEY = "tl_users";

/**
 * Obtiene todos los productos desde db.json.
 * @method getProductos
 * @returns {Promise<Array>} Lista de productos
 */
const getProductos = async () => {
  const res = await fetch("/db.json");
  if (!res.ok) throw new Error("Error al obtener productos");
  const data = await res.json();
  return data.productos;
};

/**
 * Obtiene todos los usuarios: los pre-cargados en db.json más los registrados en localStorage.
 * @method getUsuarios
 * @returns {Promise<Array>} Lista combinada de usuarios
 */
const getUsuarios = async () => {
  const res = await fetch("/db.json");
  if (!res.ok) throw new Error("Error al obtener usuarios");
  const data = await res.json();
  const seeded = data.usuarios ?? [];
  const local = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  return [...seeded, ...local];
};

/**
 * Registra un nuevo usuario guardándolo en localStorage.
 * @method addUsuario
 * @param {Object} nuevo - Datos del usuario a registrar
 * @param {string} nuevo.username - Nombre de usuario único
 * @param {string} nuevo.password - Contraseña del usuario
 * @param {string} nuevo.name - Nombre completo
 * @param {string} nuevo.email - Email del usuario
 * @returns {Promise<Object>} Usuario creado con id generado
 */
const addUsuario = async (nuevo) => {
  const stored = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const usuario = { ...nuevo, id: `user-${Date.now()}` };
  stored.push(usuario);
  localStorage.setItem(USERS_KEY, JSON.stringify(stored));
  return usuario;
};

/**
 * Simula agregar un nuevo producto (mock sin persistencia).
 * @method addProducto
 * @param {Object} nuevo - Datos del producto a agregar
 * @returns {Promise<Object>} Producto creado con id generado
 */
const addProducto = async (nuevo) => {
  return { ...nuevo, id: `prod-${Date.now()}` };
};

/**
 * Simula actualizar un producto existente (mock sin persistencia).
 * @method updateProducto
 * @param {string} id - Id del producto a actualizar
 * @param {Object} cambios - Campos a modificar
 * @returns {Promise<Object>} Producto con los cambios aplicados
 */
const updateProducto = async (id, cambios) => {
  return { id, ...cambios };
};

/**
 * Simula eliminar un producto (mock sin persistencia).
 * @method deleteProducto
 * @param {string} id - Id del producto a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
const deleteProducto = async (id) => {
  return { success: true, id };
};

export const api = { getProductos, getUsuarios, addUsuario, addProducto, updateProducto, deleteProducto };
