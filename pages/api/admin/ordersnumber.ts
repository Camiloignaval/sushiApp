import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, User } from "../../../models";
import axios from "axios";
import { endOfDay, startOfDay } from "date-fns";

type Data =
  | {
      message: string;
    }
  | any;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getOrdersNumber(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getOrdersNumber = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    await db.connect();

    const orders = await Order.find().count();

    return res.status(200).json(orders as any);
  } catch (error) {
    console.log({ errorinorderscount1: error });
    // await db.disconnect();
    return res.status(400).json({ message: "Ha ocurrido un error..." });
  }
};
