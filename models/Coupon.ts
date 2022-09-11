import mongoose, { Schema, Model, model } from "mongoose";
import { ICoupon, IPromotion } from "../interfaces";

const couponSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    expire: { type: Boolean, required: true },
    expireIn: { type: String },
    qtyAvailable: { type: Number, required: true },
    qtyUsed: { type: Number, required: true },
    type: { type: String, required: true }, //  porcentaje o cantidad de $
    discount: { type: Number, required: true },
    maxDiscount: { type: Number },
    minPurchase: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || model("Coupon", couponSchema);

export default Coupon;
