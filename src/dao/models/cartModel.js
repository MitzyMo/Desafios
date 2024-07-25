import mongoose, { SchemaTypes } from "mongoose";

const collectionName = "carts";

const cartSchema = new mongoose.Schema({
  products: [  
    {
      _id:false,
      productId: {
        type: SchemaTypes.ObjectId,
        ref: "products",
      },
      quantity: { 
        type: Number, 
        required: [true, "The quantity is mandatory"] },
    },
  ],
},
{
  timestamps: true,
}
);
// Transform function to exclude `__v` property from response
cartSchema.set('toJSON',{
  transform: function(document,retorno){
      delete retorno.__v;
      return retorno;
  }
});
export const cartModel = mongoose.model(collectionName, cartSchema);
