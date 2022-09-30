import { ISettingsStore } from "./../../../interfaces/settings";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import Settings from "../../../models/Settings";

type Data =
  | {
      message: string;
    }
  | ISettingsStore;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getSettings(req, res);
    case "PUT":
      return updateSettings(req, res);

    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const updateSettings = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body;
  try {
    await db.connect();
    await Settings.findOneAndReplace({}, body, { upsert: true });
    await db.disconnect();
    return res.status(200).json({ message: "Actualizado con éxito" });
  } catch (error) {
    await db.disconnect();
    console.log({ errorinsettings: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
const getSettings = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const body = req.body;
  try {
    await db.connect();
    const settings = await Settings.findOne({});
    await db.disconnect();
    return res.status(200).json(settings!);
  } catch (error) {
    await db.disconnect();
    console.log({ errorinsettings: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
