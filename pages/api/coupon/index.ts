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
      return validateCoupon(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const validateCoupon = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { c: code = "", a: amount = 0 } = req.query;
  console.log({ amount });
  await db.connect();
  const cupon = await Coupon.findOne({ code })
    .select("-__v -createdAt -updatedAt")
    .lean();
  await db.disconnect();

  if (!cupon) {
    return res.status(400).json({ message: "Cupón no valido" });
  }
  // si tiene fecha de expiracion
  if (cupon.expire) {
    const fechaExp = new Date(cupon.expireIn!);
    const isCaducated = isAfter(new Date(), fechaExp);
    if (isCaducated) {
      return res.status(400).json({ message: "Cupón ha expirado" });
    }
  }
  //   validar que no se haya alcanzado el limite de cupones usados
  if (cupon.qtyUsed >= cupon.qtyAvailable) {
    return res.status(400).json({ message: "Cupón ha superado el limite" });
  }

  //   si hay monto minimo
  if (cupon.minPurchase) {
    if (amount < cupon.minPurchase) {
      return res
        .status(400)
        .json({
          message: `Monto minimo para utilizar cupon es ${currency.format(
            cupon.minPurchase
          )}`,
        });
    }
  }
  return res.status(200).json({ cupon });
};
