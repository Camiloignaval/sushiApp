import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../database";
import { ISettingsStore } from "../../interfaces";
import { Settings } from "../../models";

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
  try {
    await db.connect();
    const settings = await Settings.find();
    await db.disconnect();
    return res.status(200).json(settings[0]!);
  } catch (error) {
    await db.disconnect();
    console.log({ errorsettingsclient: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
