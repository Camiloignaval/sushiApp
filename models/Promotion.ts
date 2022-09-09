import mongoose, { Schema, Model, model } from "mongoose";
import { IPromotion } from "../interfaces";

const promotionSchema = new Schema(
  {
    promotionItems: { type: Array },
    price: { type: Number, required: true, default: 1000 },
    inOffer: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    name: { type: String, unique: true },
    description: { type: String },
    images: { type: Array },
    lastPrice: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number },
    unit: { type: String },
  },
  {
    timestamps: true,
  }
);

const Promotion: Model<IPromotion> =
  mongoose.models.Promotion || model("Promotion", promotionSchema);

export default Promotion;
