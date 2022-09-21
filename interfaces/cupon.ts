import { Schema } from "mongoose";
export interface ICoupon {
  _id?: Schema.Types.ObjectId | string;
  name: string;
  code: string;
  startIn: string;
  expire: boolean;
  expireIn?: string;
  qtyAvailable: number;
  qtyUsed?: number;
  type: ITypeCoupon;
  discount: number;
  maxDiscount?: number;
  minPurchase?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ITypeCoupon = "percentage" | "money";
