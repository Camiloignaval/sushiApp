import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const products = await Product.find().lean();
    // await db.disconnect();

    // TODO  must update images
    return res.status(200).json(products);
  } catch (error) {
    console.log({ errorproductclient2: error });
    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
