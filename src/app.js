import express from "express";
import { engine } from "express-handlebars";
import {Server} from "socket.io"
import productRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import path from 'path'; // Import path module
import __dirname from "./utils.js"; // Import __dirname from utils.js

const PORT = 3000;
const app = express();
let serverSocket;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, 'views'));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const serverHTTP = app.listen(PORT, (error) => {
  if (error) {
    throw new Error("Failed to start the server:", error);
  }
  return console.log(`Server connected in port ${PORT}`);
});

// const io = new Server(serverHTTP); To call socket io.
serverSocket = new Server(serverHTTP);

//listens to any connection from the client
serverSocket.on("connection", socket => {
  console.log(`Client with id ${socket.id}`);
}) //End of connection