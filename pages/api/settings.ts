import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../database";
import { IProduct, ISettingsStore } from "../../interfaces";
import Settings from "../../models/Settings";

type Data =
  | {
      message: string;
    }
  | ISettingsStore;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getSettings(req, res);
    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const getSettings = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const body = req.body;
  console.log({ body });
  try {
    await db.connect();
    const settings = await Settings.findOne({});
    await db.disconnect();
    return res.status(200).json(settings!);
  } catch (error) {
    await db.disconnect();

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
