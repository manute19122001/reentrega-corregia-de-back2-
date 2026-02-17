// Importamos el ProductManager
const ProductManager = require('../managers/product.manager'); 
const productManager = new ProductManager(); // Instanciamos el manager
const productController = {
  // Obtener todos los productos
  getAllProducts: async (req, res) => {
    try {
      const products = await productManager.getAll();
      res.json(products); // Enviamos los productos como respuesta JSON
    } catch (err) {
      console.error("Error al obtener productos:", err);
      res.status(500).json({ message: "Error interno del servidor al obtener productos." });
    }
  },
  // Obtener un producto por ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
      const product = await productManager.getById(id);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado." });
      }
      res.json(product);
    } catch (err) {
      console.error(`Error al obtener el producto ${req.params.id}:`, err);
      res.status(500).json({ message: "Error interno del servidor al obtener el producto." });
    }
  },
  // Crear un nuevo producto
  createProduct: async (req, res) => {
    try {
      const productData = req.body; // Los datos del producto vienen en el cuerpo de la petición
      const newProduct = await productManager.create(productData);
      res.status(201).json(newProduct); // Respondemos con el producto creado y un status 201 (Created)
    } catch (err) {
      console.error("Error al crear producto:", err);
      res.status(500).json({ message: "Error interno del servidor al crear el producto." });
    }
  }
  // Aquí podríamos añadir más funciones como updateProduct, deleteProduct, etc.
};
module.exports = productController;