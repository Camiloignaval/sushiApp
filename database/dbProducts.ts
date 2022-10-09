import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductById = async (id: string): Promise<IProduct | null> => {
  try {
    await db.connect();
    const promotion = await Product.findById(id).lean();
    // await db.disconnect();
    if (!promotion) {
      return null;
    }

    return JSON.parse(JSON.stringify(promotion));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbproducts: error });
    return null;
  }
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    await db.connect();
    const products = await Product.find({})
      .select("title slug price inStock images -_id")
      .lean();
    // await db.disconnect();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbproducts: error });
    return [];
  }
};
export const getSauces = async (): Promise<IProduct[]> => {
  try {
    await db.connect();
    const products = await Product.find({ type: "sauce" })
      .select("image name")
      .lean();
    // await db.disconnect();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbproducts: error });
    return [];
  }
};
