const Cart = require('../models/cart.model');

class CartManager {
  async createCart() {
    const cart = new Cart({ products: [] });
    return await cart.save();
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);

    const index = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (index !== -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }
}

module.exports = CartManager;
