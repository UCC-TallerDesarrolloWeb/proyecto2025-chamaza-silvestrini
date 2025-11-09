import { productos } from "./data"; 

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async getProductos() {
    await delay(400);
    return [...productos]; 
  },

  async addProducto(nuevo) {
    await delay(200);
    const id = Date.now().toString(); 
    const productoNuevo = { ...nuevo, id };
    productos.push(productoNuevo);
    return productoNuevo;
  },

  async updateProducto(id, cambios) {
    await delay(200);
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");
    productos[index] = { ...productos[index], ...cambios };
    return productos[index];
  },

  async deleteProducto(id) {
    await delay(200);
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");
    const [eliminado] = productos.splice(index, 1);
    return { success: true, deleted: eliminado };
  },
};
