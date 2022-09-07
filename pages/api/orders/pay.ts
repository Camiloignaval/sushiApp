import axios, { Axios } from "axios";
import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IPaypal } from "../../../interfaces";
import { Order } from "../../../models";

type Data = {
  message: string;
};

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getPapyalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data?.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error?.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // TODO validar sesion de usuario
  try {
    const { transactionId = "", orderId = "" } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Id de orden inválido",
      });
    }

    const paypalBearerToken = await getPapyalBearerToken();

    if (!paypalBearerToken) {
      return res.status(400).json({
        message: "No se pudo confirmar token de paypal",
      });
    }

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
      `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${paypalBearerToken}`,
        },
      }
    );

    if (data.status !== "COMPLETED") {
      return res.status(401).json({
        message: "Orden no reconocida",
      });
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);

    if (!dbOrder) {
      await db.disconnect();
      return res.status(400).json({
        message: "Orden no existe en base de datos",
      });
    }

    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
      return res.status(400).json({
        message: "Monto pagado no es el correcto",
      });
    }

    await Order.updateOne(
      { _id: orderId },
      { transactionId: transactionId, isPaid: true }
    );

    await db.disconnect();

    return res.status(200).json({
      message: "Orden pagada",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Ha ocurrido un error durante el pago",
    });
  }
};
