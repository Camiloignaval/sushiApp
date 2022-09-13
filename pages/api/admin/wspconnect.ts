import type { NextApiRequest, NextApiResponse } from "next";
import qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";
import { sendMessage } from "../../../utils/whatsapp";
import ora from "ora";
import chalk from "chalk";

// const withSession = () => {
// Si existe el archivo de sesion
const spinner = ora(
  `${chalk.yellow("Validando session con Whatsapp ... ")}`
).start();
const type = "withSession";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
    dataPath: "./.wwebjs_auth",
  }),
  restartOnAuthFail: true,

  puppeteer: {
    headless: true,
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
    client.on("authenticated", async () => {
      console.log({ message: "Already authenticated" });
      spinner.stop();
    });

    client.on("auth_failure", (msg) => {
      console.error("AUTHENTICATION FAILURE", msg);
      spinner.stop();
    });

    client.on("disconnected", (reason) => {
      console.log("Client was logged out", reason);
      client.initialize(); // this what i was need
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
  const { number = "569457061950", msg = "" } = req.body;
  try {
    console.log("llegue al endpoint");
    // const resp = await client.sendMessage(
    //   `${number.replaceAll("+", "")}@c.us`,
    //   'mensaje'
    // );
    // if (resp.id.fromMe) {
    //   console.log({ success: "The message has been send" });
    // }
    sendMessage(number, msg);

    return res.status(200).json({ message: "Message Send" });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ message: "Ha ocurrido un error" });
  }
};

export { client };
