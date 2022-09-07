import mongoose, { Schema, Model, model } from "mongoose";
import { IOrder } from "../interfaces";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true, default: "specialized" },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      adress: { type: String, required: true },
      commune: { type: String, required: true },
      city: { type: String, required: true, default: "Santiago" },
      phone: { type: String, required: true },
    },
    numberOfItems: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    // tax: { type: Number, required: true },
    total: { type: Number, required: true },
    deliverPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String },
    status: {
      type: String,
      enum: {
        values: ["entered", "process", "dispatched", "delivered"],
      },
    },
    // transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || model("Order", orderSchema);

export default Order;
