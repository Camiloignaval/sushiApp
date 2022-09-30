import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

type Data = {
  message: string;
  qr?: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return sendMessage(req, res);

    default:
      res.status(400).json({ message: "Bad request" });
  }
}

const sendMessage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { phone, message } = req.body;
  try {
    try {
      await axios.post(`${process.env.HOST_WSP_API ?? ""}/send-message`, {
        number: phone,
        message,
        key: process.env.KEY_API_WSP ?? "",
      });
    } catch (error) {
      console.log({ errorinwsp: error });
      throw new Error("No ha sido posible enviar mensaje...");
    }

    return res.status(200).json({ message: "Mensaje enviado" });
  } catch (error) {
    console.log({ errorinwsp: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Unknown error" });
    }
  }
};

// * posible endpoint para envio de mensajes
