import { ICategory } from "./../../../../interfaces/category";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import { IPromotion } from "../../../../interfaces";
import { Category, Promotion } from "../../../../models";

type Data =
  | {
      message: string;
    }
  | ICategory[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getCategories(req, res);
    case "PUT":
      return changeName(req, res);
    case "POST":
      return newCategory(req, res);
    case "DELETE":
      return deleteCategory(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getCategories = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    await db.connect();
    const categories = await Category.find(/* condition */)
      .select("-updatedAt")
      .sort({ importanceNumber: -1, createdAt: 1 })
      .lean();
    // await db.disconnect();

    res.status(200).json(categories);
  } catch (error) {
    console.log({ errorincategories0: error });
    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const changeName = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { id, name } = req.body;
    await db.connect();
    const categories = await Category.findByIdAndUpdate(id, { name });
    if (!categories) {
      return res.status(400).json({ message: "Id de categoria no existe" });
    }

    // await db.disconnect();

    res.status(200).json({ message: "Actualizado con éxito" });
  } catch (error) {
    console.log({ errorincategories1: error });

    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
const newCategory = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { body } = req;
    await db.connect();
    const categoryInBdd = await Category.find({ name: body.trim() });
    if (categoryInBdd.length > 0) {
      // await db.disconnect();
      throw new Error("Nombre ya existe en base de datos");
    }
    const newCategory = new Category({ name: body.trim() });
    await newCategory.save();

    // await db.disconnect();

    res.status(200).json({ message: "Actualizado con éxito" });
  } catch (error) {
    // await db.disconnect();
    console.log({ errorincategories2: error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
const deleteCategory = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { body = "" } = req;
  try {
    await db.connect();
    const promosWithThisCategory = await Promotion.find({ category: body });
    if (promosWithThisCategory.length > 0)
      throw new Error(
        "Primero debe eliminar artículos relacionados a esta categoría"
      );
    const category = await Category.findByIdAndDelete(body);
    // await db.disconnect();

    if (!category) throw new Error("Id solicitado no existe");
    res.status(200).json({ message: "Eliminada con éxito" });
  } catch (error) {
    console.log({ errorincategories3: error });
    if (error instanceof Error) {
      // await db.disconnect();

      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
