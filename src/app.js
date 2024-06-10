import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import path from "path";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import { productModel } from "./dao/models/productModel.js";
import { messagesModel } from "./dao/models/messageModel.js";
import sessions from "express-session";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passportConfig.js";
import passport from "passport";
import { config } from "./config/config.js";

const PORT = config.PORT;
const app = express();
let serverSocket;
passport
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  sessions({
    secret: config.UTIL_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      ttl: 3600,
      mongoUrl: config.MONGO_URL,
      dbName: config.DB_NAME,
      collectionName:"sessions"
    }),
  })
);
initPassport()
app.use(passport.initialize())
app.use(passport.session()) 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

const serverHTTP = app.listen(PORT, (error) => {
  if (error) {
    throw new Error("Failed to start the server:", error);
  }
  return console.log(`Server connected in port ${PORT}`);
});

const bdConnection = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {
      dbName: config.DB_NAME,
    });
    console.log("Mongoose online");
  } catch (error) {
    console.log("Error DB", error.message);
  }
};

bdConnection();

serverSocket = new Server(serverHTTP);

serverSocket.on("connection", async (socket) => {
  console.log(`Client with id ${socket.id}`);
  const products = await productModel.find();
  socket.emit("products", products);

  let users = [];

  console.log(`User with id: ${socket.id}`);

  socket.on("id", async (name) => {
    users.push({ id: socket.id, name });
    let messages = await messagesModel.find().lean();
    messages = messages.map((m) => {
      return { name: m.user, message: m.message };
    });
    socket.emit("previousMessage", messages);
    socket.broadcast.emit("newUser", name);
  });

  socket.on("message", async (name, message) => {
    await messagesModel.create({ user: name, message });
    serverSocket.emit("newMessage", name, message);
  });
});

// Consolidate "exit" event listeners into a single listener
process.on("exit", (code) => {
  console.log(`Process exiting with code ${code}`);
  // Clean up resources, if necessary
});

export default serverSocket;
