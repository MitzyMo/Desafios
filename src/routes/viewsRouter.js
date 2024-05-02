import express from "express";
import { productModel } from "../dao/models/productModel.js";
const router = express.Router();

//Retorna todos los productos
router.get("/", async (request, response) => {
  try {
    let data = await productModel.find().lean();
    let limit = request.query.limit;
    if (Number(limit) && limit > 0) {
      data = data.slice(0, limit);
    }
    response.status(200).render("home", { data, limit, styles: "main.css" });
  } catch (error) {
    response
      .status(500)
      .render("error", { error: "Internal Server Error", styles: "main.css" });
  }
});

router.get("/realtimeproducts", (request, response) => {
  return response
    .status(200)
    .render("realTimeProducts", { styles: "main.css" });
});

router.get("/chat", (request, response) => {
  return response.status(200).render("chat", { styles: "main.css" });
});

export default router;
