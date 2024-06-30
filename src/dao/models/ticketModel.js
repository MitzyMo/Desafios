import mongoose, { SchemaTypes } from "mongoose";

const collectionName = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {type: String, unique: true, required: true},
  purchase_datetime: {type: Date, required: true, default: Date.now},
  amount: {type: Number, required: true},
  purchaser: {type: String, required: true},
},
{
  timestamps: true,
}
);
// Transform function to exclude `__v` property from response
ticketSchema.set('toJSON',{
  transform: function(document,retorno){
      delete retorno.__v;
      return retorno;
  }
});
export const ticketModel = mongoose.model(collectionName, ticketSchema);
