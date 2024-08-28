import mongoose, { SchemaTypes } from "mongoose";
const collectionName = "users";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "Your first name is mandatory"] },
  lastName: { type: String, required: [true, "Your last name is mandatory"] },
  email: {
    type: String,
    required: [true, "The email is mandatory and must be unique"],
    unique: true,
  },
  age: { type: String },
  password: { type: String, required: true },
  cart: {
    type: SchemaTypes.ObjectId,
    ref: "carts",
  },
  role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  last_connection: { type: Date },
});

userSchema.set("toJSON", {
  transform: function (document, retorno) {
    delete retorno.__v;
    delete retorno.password;
    return retorno;
  },
});

export const userModel = mongoose.model(collectionName, userSchema);