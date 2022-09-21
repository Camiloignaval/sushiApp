import { isValidObjectId } from "mongoose";
import { db } from ".";
import { ICoupon } from "../interfaces";
import Coupon from "../models/Coupon";

export const getAllCoupons = async (): Promise<ICoupon[]> => {
  db.connect();
  const cupones = await Coupon.find().lean();
  db.disconnect();

  return JSON.parse(JSON.stringify(cupones));
};

export const getCouponById = async (id: string): Promise<ICoupon | null> => {
  db.connect();
  if (!isValidObjectId(id)) return null;
  const cupon = await Coupon.findById(id).select(
    "-createdAt -updatedAt -qtyUsed"
  );
  console.log({ cupon });
  if (!cupon) return null;
  return JSON.parse(JSON.stringify(cupon));
};
