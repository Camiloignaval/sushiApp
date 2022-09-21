import mongoose, { Schema, Model, model } from "mongoose";
import { ICoupon } from "../interfaces";
import mongoose_delete from "mongoose-delete";

const couponSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    expire: { type: Boolean, required: true, default: false },
    expireIn: { type: String },
    startIn: { type: String, required: true },
    qtyAvailable: { type: Number, required: true },
    qtyUsed: { type: Number, required: true, default: 0 },
    type: { type: String, required: true }, //  porcentaje o cantidad de $
    discount: { type: Number, required: true },
    maxDiscount: { type: Number },
    minPurchase: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

couponSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || model("Coupon", couponSchema);

export default Coupon;
