import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product } from "../../../models";
import { IProduct } from "../../../interfaces";

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
      return searchProducts(req, res);
    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q = "" } = req.query;
  try {
    if (q.toString().trim().length === 0) {
      return res.status(400).json({
        message: "Must provide a search term",
      });
    }
    q = q.toString().toLowerCase();

    await db.connect();
    const products = await Product.find({ $text: { $search: q } })
      .select("title slug price inStock images -_id")
      .lean();
    await db.disconnect();
    return res.status(200).json(products);
  } catch (error) {
    console.log({ errorsearch: error });
    await db.disconnect();

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
