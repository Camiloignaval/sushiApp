import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Category, Promotion } from "../../../models";
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
      return updateCategoryStatus(req, res);
    case "DELETE":
      return deleteImportance(req, res);

    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const updateCategoryStatus = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body;
  try {
    await db.connect();
    await Category.findByIdAndUpdate(body.id, { [body.category]: body.value });
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
    const deletedIimportance = await Category.findByIdAndUpdate(id, {
      $unset: { importanceNumber: "" },
    });
    if (!deletedIimportance) {
      // await db.disconnect();
      return res.status(400).json({
        message: "No existe categoría con id indicado",
      });
    }
    await db.disconnect();

    res.status(200).json({ message: "Importancia eliminada" });
  } catch (error) {
    console.log({ errorinpromotions3: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
