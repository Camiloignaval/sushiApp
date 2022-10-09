import { isValidObjectId } from "mongoose";
import { db } from ".";
import { ICoupon } from "../interfaces";
import Coupon from "../models/Coupon";

export const getAllCoupons = async (): Promise<ICoupon[]> => {
  try {
    await db.connect();
    const cupones = await Coupon.find().lean();
    // await db.disconnect();

    return JSON.parse(JSON.stringify(cupones));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbcoupons: error });
    return JSON.parse(JSON.stringify([]));
  }
};

export const getCouponById = async (id: string): Promise<ICoupon | null> => {
  try {
    await db.connect();
    if (!isValidObjectId(id)) return null;
    const cupon = await Coupon.findById(id).select(
      "-createdAt -updatedAt -qtyUsed"
    );
    // await db.disconnect();
    if (!cupon) return null;
    return JSON.parse(JSON.stringify(cupon));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbcoupon: error });
    return null;
  }
};
