import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product, Promotion } from "../../../models";
import { v2 as cloudinary } from "cloudinary";
import Coupon from "../../../models/Coupon";
cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    // case "GET":
    //   return getProducts(req, res);

    case "PUT":
      return updateCoupon(req, res);
    case "POST":
      return createCoupon(req, res);
    // case "DELETE":
    //   return deletePromotion(req, res);

    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const updateCoupon = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body;
  try {
    await db.connect();
    const cuponresp = await Coupon.findByIdAndUpdate(body._id, body);
    await db.disconnect();
    if (!cuponresp) throw new Error("Ha ocurrido un error");

    return res.status(200).json({ message: "Actualizado con éxito" });
  } catch (error) {
    await db.disconnect();

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const createCoupon = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const { name = "", code = "" } = req.body;
    await db.connect();
    const findSameCoupon = await Coupon.find({ $or: [{ name }, { code }] });
    if (findSameCoupon.length > 0) {
      await db.disconnect();
      return res.status(400).json({
        message: "Ya existe una cupón con ese nombre o código",
      });
    }
    const cupon = new Coupon(req.body);
    await cupon.save();
    await db.disconnect();
    res.status(201).json({ message: "Creado con éxito" });
  } catch (error) {
    console.log({ error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};

// const deletePromotion = async (
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) => {
//   const { body: id = "" } = req;

//   try {
//     await db.connect();
//     const deletedPromotion = await Promotion.findByIdAndDelete(id);
//     if (!deletedPromotion) {
//       return res.status(400).json({
//         message: "No existe promoción con id indicado",
//       });
//     }
//     res.status(200).json({ message: "Promoción eliminada con éxito" });
//   } catch (error) {
//     console.log({ error });
//     await db.disconnect();
//     res.status(500).json({ message: "Algo ha salido mal..." });
//   }
// };
