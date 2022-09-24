import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, User } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getOrders(req, res);

    case "PUT":
      return changeStatus(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const queryParams = req.query;
  await db.connect();
  const orders = await Order.find(queryParams)
    .sort({ createdAt: "desc" })
    .lean();
  await db.disconnect();
  return res.status(200).json(orders);
};
const changeStatus = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { ids = [], newStatus = "" } = req.body;
  try {
    if (!ids.every((id: string) => isValidObjectId(id)))
      return res
        .status(400)
        .json({ message: "Uno o mas de los ids enviados no son válidos" });
    const ordenes = await Order.find({ _id: { $in: ids } });
    if (ordenes.length !== ids.length)
      return res
        .status(400)
        .json({ message: "Uno o mas de los ids no existen" });

    await db.connect();
    await Order.updateMany({ _id: { $in: ids } }, { status: newStatus });
    await db.disconnect();
    return res.status(200).json({ message: "Ordenes actualizadas" });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: "Ha ocurrido un error..." });
  }
};
