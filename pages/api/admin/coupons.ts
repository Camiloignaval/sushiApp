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

// const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
//   await db.connect();
//   const products = await Product.find().lean();
//   await db.disconnect();

//   // TODO  must update images
//   return res.status(200).json(products);
// };

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
    console.log({ llegue: req.body });
    const { name = "" } = req.body;
    await db.connect();
    const findBySameName = await Promotion.findOne({ name });
    if (findBySameName) {
      await db.disconnect();
      return res.status(400).json({
        message: "Ya existe una promoción con este nombre",
      });
    }
    if (req.body.images.length === 0) {
      return res.status(400).json({
        message: "Debe seleccionar a lo menos 1 imágen",
      });
    }
    const product = new Promotion(req.body);
    await product.save();
    res.status(201).json({ message: "Creado con éxito" });
  } catch (error) {
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
