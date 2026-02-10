const Product = require('../models/Product');

class ProductManager {
  async getAll() {
    return await Product.find();
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }
}

module.exports = ProductManager;
