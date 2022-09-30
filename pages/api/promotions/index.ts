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
  try {
    await db.connect();
    const promotions = await Promotion.find(/* condition */)
      .select("-createdAt -updatedAt")
      .populate("category")
      .sort("importanceNumber")
      .lean();
    await db.disconnect();

    res.status(200).json(promotions);
  } catch (error) {
    console.log({ errorinpromotionsclient: error });
    await db.disconnect();

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
