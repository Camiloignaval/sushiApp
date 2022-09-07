import mongoose, { Schema, Model, model } from "mongoose";
import { IProduct } from "../interfaces";

const productSchema = new Schema(
  {
    image: { type: String },
    inStock: { type: Boolean },
    price: { type: Number, required: true, default: 0 },
    name: { type: String, required: true, default: "" },
    fillingType: {
      type: String,
      enum: {
        values: ["protein", "vegetable"],
        message: "{VALUE} is not a valid type",
      },
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["envelope", "filling", "sauce"],
        message: "{VALUE} is not a valid ingredient",
      },
      default: "filling",
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || model("Product", productSchema);

export default Product;
