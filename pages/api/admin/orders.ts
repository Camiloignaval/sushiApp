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
  const today = new Date();
  const tomorrow = new Date(today.getDate() + 1);

  try {
    let {
      page = 1,
      limit = 20,
      status = "ingested,inprocess,dispatched",
      startDate = undefined,
      endDate = undefined,
      phoneToFind = undefined,
    } = queryParams;
    // console.log({ status, startDate, endDate, phoneToFind });
    const queryToSend = {} as any;

    if (phoneToFind) {
      queryToSend["shippingAddress.phone"] = `+${phoneToFind}`;
    }
    queryToSend["status"] = { $in: (status as string).split(",") };

    if (startDate && endDate) {
      queryToSend["createdAt"] = {
        $gte: startOfDay(new Date(startDate as string)),
        $lt: endOfDay(new Date(endDate as string)),
      };
    }

    console.log({ queryToSend });

    await db.connect();
    //TODO agregar filtros
    const orders = await Order.paginate(
      queryToSend,
      // TODO NO SE PUEDE OR
      // reservedHour: {
      //   $exists: true,
      //   $gte: startOfDay(new Date()),
      //   $lt: endOfDay(new Date()),
      // },
      // },
      { page, limit, sort: { createdAt: "asc" } }
    );

    await db.disconnect();
    return res.status(200).json(orders as any);
  } catch (error) {
    console.log({ errorinorders1: error });
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
    console.log({ errorinorders2: error });
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
    if (newStatus === "delivered") {
      await Order.updateMany(
        { _id: { $in: ids } },
        { status: newStatus, paidAt: Date.now() }
      );
    } else {
      await Order.updateMany({ _id: { $in: ids } }, { status: newStatus });
    }
    await db.disconnect();
    return res.status(200).json({ message: "Ordenes actualizadas" });
  } catch (error) {
    await db.disconnect();
    console.log({ errorinorders3: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
