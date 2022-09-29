import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, User } from "../../../models";
import axios from "axios";

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
    case "DELETE":
      return anulateOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const queryParams = req.query;
  try {
    let {
      page = 1,
      limit = 20,
      status = ["ingested", "inprocess", "dispatched"],
    } = queryParams;
    await db.connect();
    //TODO agregar filtros
    const orders = await Order.paginate(
      { status: { $in: status } },
      { page, limit, sort: { createdAt: "asc" } }
    );

    await db.disconnect();
    return res.status(200).json(orders as any);
  } catch (error) {
    await db.disconnect();

    return res.status(400).json({ message: "Ha ocurrido un error..." });
  }
};
const anulateOrder = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const idsOrder = req.body;
  try {
    await db.connect();
    await Order.updateMany({ _id: { $in: idsOrder } }, { deleted: true });
    await db.disconnect();
    return res.status(200).json({ message: "Eliminadas" });
  } catch (error) {
    console.log({ error: error.message });
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
    console.log({ newStatus });
    if (newStatus === "dispatched") {
      const numbersPhone = await Order.find({ _id: { $in: ids } }).select(
        "shippingAddress.phone -_id"
      );
      try {
        const respApi = await Promise.all(
          numbersPhone.map(
            async (n: any) =>
              await axios.post(
                `${process.env.HOST_WSP_API ?? ""}/send-message`,
                {
                  number: n.shippingAddress.phone,
                  message: "Hola denuevo, su pedido ya va en camino!",
                  key: process.env.KEY_API_WSP ?? "",
                }
              )
          )
        );
      } catch (error) {
        throw new Error("Favor revise la conección con Whatsapp");
      }
    }
    await Order.updateMany({ _id: { $in: ids } }, { status: newStatus });
    await db.disconnect();
    return res.status(200).json({ message: "Ordenes actualizadas" });
  } catch (error) {
    await db.disconnect();
    console.log({ error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
