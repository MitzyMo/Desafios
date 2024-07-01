import express from "express";
import { mockProducts } from "../utils/mockingModule.js";

const mockingRouter = express.Router();

mockingRouter.get("/mockingproducts", mockProducts);

export default mockingRouter;
