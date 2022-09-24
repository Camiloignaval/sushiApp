import { db } from ".";
import { IProduct, IPromotion } from "../interfaces";
import { Product, Promotion } from "../models";

export const getPromotionById = async (
  id: string
): Promise<IPromotion | null> => {
  await db.connect();
  const promotion = await Promotion.findById(id).lean();
  await db.disconnect();
  if (!promotion) {
    return null;
  }
  return JSON.parse(JSON.stringify(promotion));
};

interface ProductSlugs {
  slug: string;
}

export const getAllPromotions = async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Promotion.find({}).populate("category").lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify(products));
};
