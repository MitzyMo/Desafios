import mongoose from "mongoose";

const messagesCollection = "messages";
const messagesSchema = new mongoose.Schema({
  user: { type: String, required:[ture, 'The User Name is mandatory']} ,
  message: { type: String, required:[ture, 'The message is mandatory']} ,
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);