import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IPromotion } from "../../../interfaces";
import Promotion from "../../../models/Promotion";

type Data =
  | {
      message: string;
    }
  | IPromotion[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getPromotions(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getPromotions = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  // const { gender } = req.query;}
  // let condition = {};
  // if (gender !== "all" && SHOP_CONSTANT.validGenders.includes(`${gender}`)) {
  //   condition = { gender };
  // }
  await db.connect();
  const promotions = await Promotion.find(/* condition */)
    .select("-createdAt -updatedAt")
    .populate("category")
    .lean();
  await db.disconnect();

  res.status(200).json(promotions);
};
