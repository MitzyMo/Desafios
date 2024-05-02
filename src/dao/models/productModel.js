import mongoose from "mongoose";

const collectionName = "products";
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "The Product Name is mandatory"] },
    description: {type: String,required: [true, "The Description is mandatory"],},
    code: {type: String,required: [true, "The Code is mandatory and must be unique"],unique: true,},
    price: { type: Number, required: [true, "The Price is mandatory"] },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5 },
    status: { type: Boolean, default: true},
    stock: { type: Number, required: [true, "The Stock is mandatory"] },
    brand: { type: String },
    category: { type: String, required: [true, "The Category is mandatory"] },
    thumbnail: [{ type: String }],
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
productSchema.set('toJSON',{
    transform: function(document,retorno){
        delete retorno.__v;
        return retorno;
    }
});
export const productModel = mongoose.model(collectionName, productSchema);
