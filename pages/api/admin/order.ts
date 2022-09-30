import axios from "axios";
import { isValidObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order } from "../../../models";
import { orderMessageWsp } from "../../../utils/orderMessageWsp";

type Data =
  | {
      message: string;
    }
  | IOrder[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return retryConfirmOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const retryConfirmOrder = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { orderId = "", phone = "" } = req.body;
  try {
    if (!isValidObjectId(orderId)) throw new Error("Id no existe");
    await db.connect();
    const order = await Order.findById(orderId);
    if (!order) throw new Error("No existye orden con id enviado");
    if (order?.wspReceived)
      throw new Error("Usuario ya ha recibido confirmación");
    const messageToSend = orderMessageWsp(order);
    try {
      await axios.post(`${process.env.HOST_WSP_API ?? ""}/send-message`, {
        number: phone,
        message: messageToSend,
        key: process.env.KEY_API_WSP ?? "",
      });
      await Order.findByIdAndUpdate({ _id: orderId }, { wspReceived: true });
    } catch (error) {
      console.log({ errorinorder: error });
      throw new Error("No ha sido posible enviar mensaje...");
    }

    await db.disconnect();
    return res.status(200).json({ message: "Confirmacion exitosa" });
  } catch (error) {
    console.log({ errorinorder: error });
    await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
