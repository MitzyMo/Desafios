import express from "express";
import { engine } from "express-handlebars";
import productRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import path from 'path'; // Import path module
import __dirname from "./utils.js"; // Import __dirname from utils.js

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, 'views'));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw new Error("Failed to start the server:", error);
  }
  return console.log(`Server connected in port ${PORT}`);
});

