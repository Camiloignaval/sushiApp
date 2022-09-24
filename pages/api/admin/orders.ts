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
  try {
    let { page = 1, limit = 20, status } = queryParams;
    const statusQuery = status ? { status } : {};
    await db.connect();
    //TODO agregar filtros
    const orders = await Order.paginate(
      { ...statusQuery },
      { page, limit, sort: { createdAt: "desc" } }
    );

    await db.disconnect();
    return res.status(200).json(orders as any);
  } catch (error) {
    await db.disconnect();

    return res.status(400).json({ message: "Ha ocurrido un error..." });
  }
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
    await db.connect();
    const ordenes = await Order.find({ _id: { $in: ids } });
    if (ordenes.length !== ids.length)
      return res
        .status(400)
        .json({ message: "Uno o mas de los ids no existen" });

    await Order.updateMany({ _id: { $in: ids } }, { status: newStatus });
    await db.disconnect();
    return res.status(200).json({ message: "Ordenes actualizadas" });
  } catch (error) {
    await db.disconnect();
    console.log({ error });
    return res.status(400).json({ message: "Ha ocurrido un error..." });
  }
};
