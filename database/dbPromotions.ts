import { db } from ".";
import { IProduct, IPromotion } from "../interfaces";
import { Product, Promotion } from "../models";

export const getPromotionById = async (
  id: string
): Promise<IPromotion | null> => {
  try {
    await db.connect();
    const promotion = await Promotion.findById(id).lean();
    // await db.disconnect();
    if (!promotion) {
      return null;
    }
    return JSON.parse(JSON.stringify(promotion));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbpromotions: error });
    return null;
  }
};

interface ProductSlugs {
  slug: string;
}

export const getAllPromotions = async (): Promise<IProduct[]> => {
  try {
    await db.connect();
    const products = await Promotion.find({})
      .sort("-importanceNumber")
      .populate("category includesSauces")
      .lean();
    // await db.disconnect();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    // await db.disconnect();
    console.log({ errordbpromotions: error });
    return [];
  }
};
