import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import path from "path"; 
import __dirname from "./utils.js"; 
import ProductManagerModule from "./dao/ProductManagerFileSystem.js"
import mongoose from "mongoose";


const { ProductManager } = ProductManagerModule;
let filePath = path.join(__dirname,'..','src', "data", "products.json");
const manager = new ProductManager(filePath);

const PORT = 3000;
const app = express();
let serverSocket;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const serverHTTP = app.listen(PORT, (error) => {
  if (error) {
    throw new Error("Failed to start the server:", error);
  }
  return console.log(`Server connected in port ${PORT}`);
});

const bdConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://BackendUser:47l4sP455w0rd@cluster0.mywij2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "ecommerce",
      }
    );
    console.log("Mongoose online");
  } catch (error) {
    console.log("Error DB", error.message);
  }
};

bdConnection();

// const io = new Server(serverHTTP); To call socket io.
serverSocket = new Server(serverHTTP);

serverSocket.on("connection", async socket => {
  console.log(`Client with id ${socket.id}`);
  const products = await manager.getProducts();
  socket.emit("products", products);
});

export default serverSocket;

//BackendUser
//47l4sP455w0rd