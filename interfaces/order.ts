import { ICartProduct } from "./cart";
import { ICoupon } from "./cupon";
import { IShippingAdress } from "./shippingAddress";
import { IUser } from "./user";

export interface IOrder {
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
  wspReceived?: boolean;
}

export interface IOrderWithPaginate {
  docs: IOrder[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null | number;
  nextPage: null | number;
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

export interface IOrderCustomRoll {
  name: string;
  quantity: number;
  image: string;
  price: number;
  ingredients: [
    {
      image: number;
      price: number;
      name: number;
      type: number;
    }
  ];
}
