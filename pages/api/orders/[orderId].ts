import { IOrder } from "./../../../interfaces/order";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderId } = req.query;
  await db.connect();
  const order = await Order.findById(orderId).lean();
  await db.disconnect();

  return res.status(200).json(order);
};
