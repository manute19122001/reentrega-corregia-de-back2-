// managers/ProductManager.js
const Product = require('../models/product.model'); // Asegúrate de que la ruta sea correcta a tu archivo del modelo
class ProductManager {
  async getAll() {
    return await Product.find(); // Usa el modelo Product para buscar todos
  }
  async getById(id) {
    return await Product.findById(id); // Usa el modelo Product para buscar por ID
  }
  async create(productData) {
    const product = new Product(productData); // Crea una nueva instancia del modelo Product
    return await product.save(); // Guarda la nueva instancia en la base de datos
  }
}
module.exports = ProductManager;