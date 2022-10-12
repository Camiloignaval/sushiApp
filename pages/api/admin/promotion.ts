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
  console.log("hoalaaaaaaaaaaa");
  console.log({ body });
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
