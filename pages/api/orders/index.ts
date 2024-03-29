import { validateCoupon } from "./../../../utils/validateCoupon";
import { ro } from "date-fns/locale";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { ICoupon, IOrder, IProduct } from "../../../interfaces";
import { Order, Product, Promotion, User } from "../../../models";
import Coupon from "../../../models/Coupon";
import axios from "axios";
import { orderMessageWsp } from "../../../utils/orderMessageWsp";
import { Boy } from "@mui/icons-material";
type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createNewOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}
const createNewOrder = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body as IOrder;
  try {
    await db.connect();
    // calcular precio de customs roll
    let priceFinalOfRollsPersonalized = 0;

    const customRolls = body.orderItems.filter(
      (item) => item.name === "Roll personalizado"
    );
    if (customRolls?.length > 0) {
      await Promise.all(
        customRolls.map(async (p) => {
          const idsToSearch = [
            ...(p.envelopes ?? []),
            ...(p?.extraProduct ?? []),
          ].map((e) => e._id);
          const prodQtyId = [
            ...(p.envelopes ?? []),
            ...(p?.extraProduct ?? []),
          ].map((e) => ({ id: e._id, qty: e.qty, name: e.name }));
          const prod = await Product.find({ _id: { $in: idsToSearch } }).select(
            "price name"
          );
          if (prod) {
            priceFinalOfRollsPersonalized +=
              prod.reduce((acc, curr) => {
                return (
                  acc +
                  curr.price *
                    (prodQtyId.find((p) => p.name === curr.name)?.qty ?? 1)
                );
              }, 0) * +p.quantity;
          }
        })
      );
    }
    // calculo de promociones
    let priceTotalPromos = 0;
    const promos = body.orderItems.filter(
      (item) => item.name !== "Roll personalizado"
    );
    if (promos?.length > 0) {
      await Promise.all(
        promos.map(async (promo) => {
          const promoFound = await Promotion.findById(promo._id).select(
            "price inOffer offerPrice"
          );
          if (promoFound) {
            priceTotalPromos +=
              (promoFound.inOffer
                ? +promoFound!.offerPrice!
                : +promoFound.price) * +promo.quantity;
          }
        })
      );
    }
    // calculo extras
    let priceExtras = 0;

    if (body?.orderExtraItems && body?.orderExtraItems?.length > 0) {
      await Promise.all(
        body?.orderExtraItems.map(async (prod) => {
          const prodFound = await Product.findById(prod._id).select("price");
          if (prodFound) {
            priceExtras += +prodFound.price * +prod.quantity;
          }
        })
      );
    }

    const subTotal =
      priceFinalOfRollsPersonalized + priceTotalPromos + priceExtras;

    // TODO falta sumar despacho
    if (subTotal !== body.subTotal) {
      throw new Error(
        "Ha ocurrido un error, valores han sido alterados, favor reingrese orden"
      );
    }

    // validar cupon
    let discount = 0;
    let cuponType = "";
    let maxDiscount = undefined;
    let minPurchase = undefined;
    if (body?.coupon as ICoupon) {
      const cupon = await Coupon.findById((body?.coupon! as ICoupon)._id! ?? "")
        .select("-__v -createdAt -updatedAt")
        .lean();
      if (!cupon) {
        throw new Error("Cupón no existe");
      }
      validateCoupon(cupon, subTotal);
      discount = cupon.discount;
      cuponType = cupon.type;
      maxDiscount = cupon?.maxDiscount;
      minPurchase = cupon?.minPurchase;
    }
    let total = subTotal;
    if (minPurchase) {
      if (minPurchase < subTotal)
        throw new Error("Compra es inferior a requerido por cupón utilizado");
    }
    if (discount != 0) {
      if (cuponType === "percentage") {
        const discountAmount =
          Math.ceil((total * (discount / 100)) / 100) * 100;
        if (maxDiscount) {
          if (discountAmount > maxDiscount) {
            total = total - maxDiscount;
          }
          total = total - Math.ceil((total * (discount / 100)) / 100) * 100;
        } else {
          total = total - Math.ceil((total * (discount / 100)) / 100) * 100;
        }
      } else {
        total -= discount;
      }
    }

    if (total + body.deliverPrice !== body.total) {
      throw new Error(
        "Ha ocurrido un error, valores han sido alterados, favor reingrese orden"
      );
    }

    // si todo ha salido bien

    if (body.coupon) {
      await Coupon.findByIdAndUpdate((body?.coupon! as ICoupon)._id, {
        $inc: { qtyUsed: 1 },
      });
    }
    const orderToCreate: IOrder = { ...body };
    if (body?.coupon) {
      orderToCreate.coupon = (body?.coupon! as ICoupon)._id!.toString();
    }

    const { shippingAddress } = body;
    const { username, address, phone, placeId } = shippingAddress;

    const userUpdated = await User.findOneAndUpdate(
      { phone },
      {
        $set: {
          name: username,
          address,
          placeId,
          userName: username.replaceAll(" ", ""),
        },
      },
      { upsert: true, new: true }
    );

    orderToCreate.user = userUpdated._id;
    const newOrder = new Order(orderToCreate);
    await newOrder.save();

    // ENVIO INFO WHATSAP
    const linkWsp = process.env.HOST_WSP_API;
    try {
      // Armar mensaje a enviar
      const message = orderMessageWsp({ ...orderToCreate, _id: newOrder._id });
      await axios.post(`${linkWsp}/send-message`, {
        number: phone,
        message,
        key: process.env.KEY_API_WSP ?? "",
      });
    } catch (error) {
      await Order.findByIdAndUpdate(
        { _id: newOrder._id },
        { wspReceived: false }
      );
    }

    // await db.disconnect();
    return res.status(201).json({ message: "creada" });
  } catch (error) {
    console.log({ errororderclient: error.message });
    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
