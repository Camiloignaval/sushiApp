import type { NextApiRequest, NextApiResponse } from "next";
import { db, SHOP_CONSTANT } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { linkConvert } from "../../../utils";

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
  const { gender } = req.query;
  let condition = {};
  if (gender !== "all" && SHOP_CONSTANT.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }

  await db.connect();
  const products = await Product.find(condition)
    .select("title slug price inStock images -_id")
    .lean();
  await db.disconnect();

  const productsConverted = linkConvert(products);

  res.status(200).json(productsConverted);
};
