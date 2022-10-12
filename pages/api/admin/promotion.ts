import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Promotion } from "../../../models";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "PUT":
      return updatePromotionStatus(req, res);
    case "DELETE":
      return deleteImportance(req, res);

    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const updatePromotionStatus = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body;

  try {
    await db.connect();
    await Promotion.findByIdAndUpdate(body.id, { [body.category]: body.value });
    // await db.disconnect();

    return res.status(200).json({ message: "Actualizado con éxito" });
  } catch (error) {
    // await db.disconnect();
    console.log({ errorinpromotionn: error });

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const deleteImportance = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    body: { id = "" },
  } = req;

  try {
    await db.connect();
    console.log({ id });
    const deletedIimportance = await Promotion.findByIdAndUpdate(id, {
      $unset: { importanceNumber: "" },
    });
    if (!deletedIimportance) {
      // await db.disconnect();
      return res.status(400).json({
        message: "No existe promoción con id indicado",
      });
    }
    await db.disconnect();

    res.status(200).json({ message: "Promoción eliminada con éxito" });
  } catch (error) {
    console.log({ errorinpromotions3: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
