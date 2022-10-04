import { validateCoupon } from "./../../../utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { ICoupon } from "../../../interfaces";
import Coupon from "../../../models/Coupon";
import { Order } from "../../../models";

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
  const { c: code = "", a: amount = 0, p: phone = "" } = req.query;
  try {
    await db.connect();
    const cupon = await Coupon.findOne({ code })
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!cupon) {
      await db.disconnect();
      return res.status(400).json({ message: "Cupón no valido" });
    }
    const idCoupon = cupon._id;
    const isUsedByPhone = await Order.findOne({
      coupon: idCoupon,
      "shippingAddress.phone": `+56${phone}`,
    });
    if (isUsedByPhone) {
      await db.disconnect();
      return res.status(400).json({ message: "Usuario ya ha utilizado cupón" });
    }
    validateCoupon(cupon, +amount);
    await db.disconnect();
    return res.status(200).json({ cupon });
  } catch (error) {
    await db.disconnect();
    console.log({ errorincoupon: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
