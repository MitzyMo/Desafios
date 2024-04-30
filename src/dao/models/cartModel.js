import mongoose, { SchemaTypes } from "mongoose";

const collectionName = "carts";
const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: SchemaTypes.ObjectId,
        ref: "products",
      },
      quantity: { 
        type: Number, 
        required: [true, "The quantity is mandatory"] },
    },
  ],
});

export const cartModel = mongoose.model(collectionName, cartSchema);
