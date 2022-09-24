import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { v2 as cloudinary } from "cloudinary";
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
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return createProduct(req, res);
    case "DELETE":
      return deleteProduct(req, res);

    default:
      return res.status(400).json({
        message: "Method Not Allowed",
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const products = await Product.find().lean();
    await db.disconnect();

    // TODO  must update images
    return res.status(200).json(products);
  } catch (error) {
    db.disconnect();
    console.log({ error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body;
  try {
    await db.connect();
    const prod = await Product.findById(body._id).select("image");
    if (!prod) {
      throw new Error("No existe producto con id indicado");
    }
    if (prod?.image !== body.image) {
      const [fileId, extension] = (prod!.image as string)
        .substring(prod!.image.lastIndexOf("/") + 1)
        .split(".");
      await cloudinary.uploader.destroy(fileId);
      cloudinary.api.delete_resources_by_prefix(`SushiApp/${fileId}`);
    }
    await Product.findByIdAndUpdate(body._id, body);
    await db.disconnect();

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

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const { name = "", type = "", fillingType = "" } = req.body;
    await db.connect();
    const findBySameTypeAndName = await Product.findOne({ name, type });
    if (findBySameTypeAndName) {
      await db.disconnect();

      return res.status(400).json({
        message: "Ya existe un producto de este tipo con el mismo nombre",
      });
    }
    const product = new Product(req.body);
    await product.save();
    await db.disconnect();
    res.status(201).json({ message: "Creado con éxito" });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
const deleteProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { body: id = "" } = req;

  try {
    await db.connect();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(400).json({
        message: "No existe producto con id indicado",
      });
    }
    await db.disconnect();
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.log({ error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
