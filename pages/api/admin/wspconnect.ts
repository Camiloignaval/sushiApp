import type { NextApiRequest, NextApiResponse } from "next";
import qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";
import { sendMessage } from "../../../utils/whatsapp";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
    dataPath: "./.wwebjs_auth",
  }),
  puppeteer: {
    handleSIGINT: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return connectWsp(req, res);
    case "PUT":
      return sendMassage(req, res);

    default:
      res.status(400).json({ message: "Bad request" });
  }
}

const connectWsp = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    client.initialize();
    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("authenticated", async (session) => {
      console.log({ message: "Estoy autenticado ya" });
    });

    client.on("auth_failure", (msg) => {
      console.error("AUTHENTICATION FAILURE", msg);
    });

    return res.status(200).json({ message: "Conected" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Unknown error" });
    }
  }
};

// * posible endpoint para envio de mensajes

const sendMassage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { number = "569457061950" } = req.body;
  try {
    // console.log("llegue aqui");
    // const resp = await client.sendMessage(
    //   `${number.replaceAll("+", "")}@c.us`,
    //   'mensaje'
    // );
    // if (resp.id.fromMe) {
    //   console.log({ success: "The message has been send" });
    // }
    sendMessage(number);

    return res.status(200).json({ message: "Message Send" });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: "Ha ocurrido un error" });
  }
};

export { client };
