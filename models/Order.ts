import { IProduct } from "./../interfaces/products";
import mongoose, { Schema, Model, model } from "mongoose";
import { IOrder } from "../interfaces";
import mongoose_delete from "mongoose-delete";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    orderItems: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    orderExtraItems: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      username: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      placeId: { type: String, required: true },
    },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    numberOfItems: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    deliverPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String },
    status: {
      type: String,
      enum: {
        values: ["ingested", "inprocess", "dispatched", "delivered"],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Order: Model<IOrder> =
  mongoose.models.Order || model("Order", orderSchema);

export default Order;
