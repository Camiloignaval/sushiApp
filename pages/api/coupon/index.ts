import { validateCoupon } from "./../../../utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { db, SHOP_CONSTANT } from "../../../database";
import { ICoupon, IProduct, IPromotion } from "../../../interfaces";
import { Product } from "../../../models";
import Coupon from "../../../models/Coupon";
import Promotion from "../../../models/Promotion";
import { currency, linkConvert } from "../../../utils";
import { compareAsc, format, isAfter } from "date-fns";

type Data =
  | {
      message: string;
    }
  | { cupon: ICoupon };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return validCoupon(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const validCoupon = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { c: code = "", a: amount = 0 } = req.query;

  try {
    await db.connect();
    const cupon = await Coupon.findOne({ code })
      .select("-__v -createdAt -updatedAt")
      .lean();
    await db.disconnect();

    if (!cupon) {
      return res.status(400).json({ message: "Cupón no valido" });
    }
    validateCoupon(cupon, +amount);
    return res.status(200).json({ cupon });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
