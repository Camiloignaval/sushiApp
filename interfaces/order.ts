import { IShippingAdress } from "./shippingAddress";
import { IUser } from "./user";

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  orderExtraItems?: IOrderExtraItem[];
  shippingAddress: IShippingAdress;
  numberOfItems: number;
  status: IOrderStatus;
  promocionalCode?: string;
  subTotal: number;
  total: number;
  note: string;
  isPaid: boolean;
  paidAt?: string;
  deliverPrice: number;
  transactionId?: string;
  createdAt?: string;
}

export type IOrderStatus =
  | "ingested"
  | "inprocess"
  | "dispatched"
  | "delivered";
export interface IOrderItem {
  _id?: string;
  name: string;
  quantity: number;
  image: string;
  price: Number;
}

export interface IOrderExtraItem {
  _id?: string;
  name: string;
  quantity: number;
  image: string;
  price: Number;
}
