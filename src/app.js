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
import sessions from "express-session";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passportConfig.js";
import passport from "passport";
import { config } from "./config/config.js";
import { handleCustomError } from "./middleware/errorHandler.js";
import mockingRouter from "./routes/mockingRouter.js";


const PORT = config.PORT;
const app = express();
let serverSocket;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(sessions({
  secret: config.UTIL_SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    ttl: 3600,
    mongoUrl: config.MONGO_URL,
    dbName: config.DB_NAME,
    collectionName: "sessions"
  }),
}));

// Passport Configuration
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// View Engine Setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", mockingRouter); // New mocking endpoint

// Error Handler
app.use(handleCustomError);

// Database Connection
const bdConnection = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {
      dbName: config.DB_NAME,
    });
    console.log("Mongoose online");
  } catch (error) {
    console.error("Error DB", error.message);
  }
};
bdConnection();

// Start Server
const serverHTTP = app.listen(PORT, (error) => {
  if (error) {
    throw new Error("Failed to start the server:", error);
  }
  console.log(`Server connected on port ${PORT}`);
});

// Socket.io Setup
serverSocket = new Server(serverHTTP);
serverSocket.on("connection", async (socket) => {
  console.log(`Client connected with id ${socket.id}`);
  const products = await productModel.find();
  socket.emit("products", products);

  let users = [];

  socket.on("id", async (name) => {
    users.push({ id: socket.id, name });
    let messages = await messagesModel.find().lean();
    messages = messages.map(m => ({ name: m.user, message: m.message }));
    socket.emit("previousMessage", messages);
    socket.broadcast.emit("newUser", name);
  });

  socket.on("message", async (name, message) => {
    await messagesModel.create({ user: name, message });
    serverSocket.emit("newMessage", name, message);
  });
});

// Clean up resources on exit
process.on("exit", (code) => {
  console.log(`Process exiting with code ${code}`);
});

export default serverSocket;
