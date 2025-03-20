import { model, Schema } from "mongoose";

const todoSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
},{timestamps: true});

export default model("Todo", todoSchema);
