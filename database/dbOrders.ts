import { isValidObjectId } from "mongoose";
import { db } from ".";
import { IOrder } from "../interfaces";
import { Order } from "../models";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  try {
    if (!isValidObjectId(id)) {
      return null;
    }
    await db.connect();
    const order = await Order.findById(id).lean();
    // await db.disconnect();

    if (!order) {
      return null;
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordborders: error });
    return null;
  }
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  try {
    if (!isValidObjectId(userId)) {
      return [];
    }
    await db.connect();
    const order = await Order.find({ user: userId }).lean();
    // await db.disconnect();

    if (!order) {
      return [];
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordborders: error });
    return [];
  }
};
