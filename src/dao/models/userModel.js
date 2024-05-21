import mongoose, { SchemaTypes } from "mongoose";

const collectionName = "users";
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Your name is Mandatory"] },
  email: {
    type: String,
    required: [true, "The Code is mandatory and must be unique"],
    unique: true,
  },
  role: { type: String, default: "user" },
  password: { type: String, required: [true, "The Password is mandatory"] },
  cart: {
    type: SchemaTypes.ObjectId,
    ref: "carts",
  },
});
userSchema.set("toJSON", {
  transform: function (document, retorno) {
    delete retorno.__v;
    return retorno;
  },
});
export const userModel = mongoose.model(collectionName, userSchema);
