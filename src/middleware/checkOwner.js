import { ProductService } from "../services/ProductService.js";

const manager = new ProductService();

export const checkOwner = (request, response, next) => {
  const { pid } = request.params;
  const user = request.session.user;
  manager.getProductById(pid)
    .then(product => {
      if (!product) {
        return response.status(404).json({ error: "Product not found." });
      }
      if (user.role === 'premium' && product.owner !== user.email) {
        return response.status(403).json({ error: "You can only modify your own products." });
      }
      next();
    })
    .catch(error => {
      response.status(500).json({ error: error.message });
    });
};