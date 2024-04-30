import mongoose, { SchemaTypes } from "mongoose";
const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: SchemaTypes.ObjectId,
        ref: "products",
      },
      quantity: { 
        type: Number, 
        required: [ture, "The quantity is mandatory"] },
    },
  ],
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
