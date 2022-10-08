import { IProduct } from "./../interfaces/products";
import mongoose, {
  Schema,
  Model,
  model,
  PaginateModel,
  Document,
} from "mongoose";
// import { IOrder } from "../interfaces";
import mongoose_delete from "mongoose-delete";
import paginate from "mongoose-paginate-v2";
import {
  IUser,
  ICartProduct,
  IShippingAdress,
  IOrderStatus,
  ICoupon,
} from "../interfaces";

interface IOrder extends Document {
  _id?: string;
  user?: IUser | string;
  orderItems: ICartProduct[];
  orderExtraItems?: ICartProduct[];
  shippingAddress: IShippingAdress;
  numberOfItems: number;
  status: IOrderStatus;
  subTotal: number;
  total: number;
  note?: string;
  isPaid: boolean;
  paidAt?: string;
  deliverPrice: number;
  transactionId?: string;
  createdAt?: string;
  coupon?: ICoupon | string;
}

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
        note: { type: String },
        proteins: { type: Array },
        vegetables: { type: Array },
        sauces: { type: Array },
        extraProduct: { type: Array },
        envelopes: { type: Array },
      },
    ],
    orderExtraItems: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        note: { type: String },
        type: { type: String, required: true },
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
    discount: { type: Number },
    reservedHour: { type: Date },
    wspReceived: { type: Boolean, required: true, default: true },
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
orderSchema.plugin(paginate);

// todo corregir el any
const Order =
  (mongoose.models.Order as any) ||
  model<IOrder, PaginateModel<IOrder>>("Order", orderSchema);
export default Order;

// mongoose.models.Order
// export const ArtistModel: ArtistModel<IArtist> = model<IArtist>('Artist', ArtistSchema) as ArtistModel<IArtist>
