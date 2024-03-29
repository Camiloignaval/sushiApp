import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product, Promotion } from "../../../models";
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
      return updatePromotion(req, res);
    case "POST":
      return createPromotion(req, res);
    case "DELETE":
      return deletePromotion(req, res);

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
    // await db.disconnect();

    // TODO  must update images
    return res.status(200).json(products);
  } catch (error) {
    console.log({ errorinpromotions0: error });

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const updatePromotion = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const body = req.body;
  try {
    await db.connect();
    const prod = await Promotion.findById(body._id).select("images");
    //todo validar que tenga 2 imagenes minimo
    if (!prod) {
      throw new Error("No existe promoción con id indicado");
    }

    // borrar imagenes que ya no se usaran
    Promise.all(
      prod?.images.map(async (img) => {
        if (!body.images.includes(img)) {
          const [fileId, extension] = (img as string)
            .substring(img.lastIndexOf("/") + 1)
            .split(".");
          await cloudinary.uploader.destroy(fileId);
          cloudinary.api.delete_resources_by_prefix(`SushiApp/${fileId}`);
        }
      })
    );
    await Promotion.findByIdAndUpdate(body._id, body);
    // await db.disconnect();

    return res.status(200).json({ message: "Actualizado con éxito" });
  } catch (error) {
    console.log({ errorinpromotions1: error });

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const createPromotion = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const { name = "" } = req.body;
    await db.connect();
    const findBySameName = await Promotion.findOne({ name });
    if (findBySameName) {
      // await db.disconnect();
      return res.status(400).json({
        message: "Ya existe una promoción con este nombre",
      });
    }
    if (req.body.images.length === 0) {
      // await db.disconnect();

      return res.status(400).json({
        message: "Debe seleccionar a lo menos 1 imágen",
      });
    }

    const product = new Promotion(req.body);
    await product.save();
    // await db.disconnect();

    res.status(201).json({ message: "Creado con éxito" });
  } catch (error) {
    console.log({ errorinpromotions2: error });

    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};

const deletePromotion = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { body: id = "" } = req;

  try {
    await db.connect();
    const deletedPromotion = await Promotion.findByIdAndDelete(id);
    if (!deletedPromotion) {
      // await db.disconnect();
      return res.status(400).json({
        message: "No existe promoción con id indicado",
      });
    }
    // await db.disconnect();

    res.status(200).json({ message: "Promoción eliminada con éxito" });
  } catch (error) {
    console.log({ errorinpromotions3: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
