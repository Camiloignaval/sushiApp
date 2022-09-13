import { Shipping } from "./../../../interfaces/paypal";
import { validateCoupon } from "./../../../utils/validateCoupon";
import { ro } from "date-fns/locale";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { ICoupon, IOrder, IProduct } from "../../../interfaces";
import { Order, Product, Promotion } from "../../../models";
import Coupon from "../../../models/Coupon";
import { sendMessage } from "../../../utils/whatsapp";
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
    db.connect();
    // calcular precio de customs roll
    let priceFinalOfRollsPersonalized = 0;

    const customRolls = body.orderItems.filter(
      (item) => item.name === "Roll personalizado"
    );
    if (customRolls.length > 0) {
      await Promise.all(
        customRolls.map(async (p) => {
          const idsToSearch = [
            ...(p.envelopes ?? []),
            ...(p?.extraProduct ?? []),
          ].map((e) => e._id);
          const prod = await Product.find({ _id: { $in: idsToSearch } }).select(
            "price"
          );
          if (prod) {
            priceFinalOfRollsPersonalized +=
              prod.reduce((acc, curr) => acc + curr.price, 0) * +p.quantity;
          }
        })
      );
    }
    // calculo de promociones
    let priceTotalPromos = 0;
    const promos = body.orderItems.filter(
      (item) => item.name !== "Roll personalizado"
    );

    if (promos.length > 0) {
      await Promise.all(
        promos.map(async (promo) => {
          const promoFound = await Promotion.findById(promo._id).select(
            "price"
          );
          if (promoFound) {
            priceTotalPromos += +promoFound.price * +promo.quantity;
          }
        })
      );
    }
    // calculo extras
    let priceExtras = 0;

    if (body?.orderExtraItems && body?.orderExtraItems.length > 0) {
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
      throw new Error("Ha ocurrido un error, valores han sido alterados");
    }

    // validar cupon
    let discount = 0;
    let cuponType = "";
    let maxDiscount = undefined;
    if (body?.coupon as ICoupon) {
      const cupon = await Coupon.findById(body?.coupon!._id ?? "")
        .select("-__v -createdAt -updatedAt")
        .lean();
      if (!cupon) {
        throw new Error("Cupón no existe");
      }
      validateCoupon(cupon, subTotal);
      discount = cupon.discount;
      cuponType = cupon.type;
      maxDiscount = cupon?.maxDiscount;
    }
    let total = subTotal;
    if (discount != 0) {
      if (cuponType === "percentage") {
        const discountAmount = total * (discount / 100);
        if (maxDiscount) {
          if (discountAmount > maxDiscount) {
            total = total - maxDiscount;
          }
        } else {
          total = total - total * (discount / 100);
        }
      } else {
        total -= discount;
      }
    }
    if (total !== body.total) {
      throw new Error("Ha ocurrido un error, valores han sido alterados");
    }

    // si todo ha salido bien

    // if (body.coupon) {
    //   await Coupon.findByIdAndUpdate(body.coupon!._id, {
    //     $inc: { qtyUsed: 1 },
    //   });
    // }
    // const orderToCreate: IOrder = { ...body };
    // if (body?.coupon) {
    //   orderToCreate.coupon = body.coupon!._id.toString();
    // }

    // prueba whatsap
    // TODO ENVIAR WHATSAPP CON DETALLE ORDEN Y LINK DE SEGUIMIENTO
    sendMessage(body.shippingAddress.phone, "Su orden xxxxxxx");
    // client.on("message", (message) => {
    //   message.reply("hola probando");
    // });

    // wspMessage();

    // const newOrder = new Order(orderToCreate);
    // await newOrder.save();

    return res.status(201).json({ message: "creada" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
