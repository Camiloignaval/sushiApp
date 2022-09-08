import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product, User } from "../../../models";
import { v2 as cloudinary } from "cloudinary";
import { linkConvert } from "../../../utils";
cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    // case "PUT":
    //   return updateProduct(req, res);
    // case "POST":
    //   return createProduct(req, res);

    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();

  // TODO  must update images
  return res.status(200).json(products);
};

// const updateProduct = async (
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) => {
//   const { _id = "", images = [] } = req.body as IProduct;

//   if (!isValidObjectId(_id)) {
//     return res.status(400).json({ message: "Id de producto no es valido" });
//   }

//   if (images.length < 2) {
//     return res
//       .status(400)
//       .json({ message: "Es necesario al menos 2 imágenes" });
//   }

//   try {
//     await db.connect();
//     const product = await Product.findById(_id);

//     if (!product) {
//       return res
//         .status(400)
//         .json({ message: "Producto no existe en registros" });
//     }

//     product.images.forEach(async (image) => {
//       if (!images.includes(image)) {
//         // borrar de cloudinary
//         const [fileId, extension] = image
//           .substring(image.lastIndexOf("/") + 1)
//           .split(".");
//         console.log({ fileId });
//         await cloudinary.uploader.destroy(fileId);
//       }
//     });

//     await product.updateOne(req.body);
//     await db.disconnect();

//     res.status(200).json({ message: "Usuario actualizado" });
//   } catch (error) {
//     await db.disconnect();
//     res.status(500).json({ message: "Algo ha salido mal..." });
//   }
// };
// const createProduct = async (
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) => {
//   const { images = [], slug = "" } = req.body as IProduct;

//   if (images.length < 2) {
//     return res
//       .status(400)
//       .json({ message: "Es necesario al menos 2 imágenes" });
//   }

//   try {
//     await db.connect();
//     const slugInBd = await Product.findOne({ slug });
//     if (slugInBd) {
//       await db.disconnect();
//       return res
//         .status(400)
//         .json({ message: "Slug ya existe en los registros, debe ser único" });
//     }
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json({ message: "Creado con éxito" });
//   } catch (error) {
//     await db.disconnect();
//     res.status(500).json({ message: "Algo ha salido mal..." });
//   }
// };
