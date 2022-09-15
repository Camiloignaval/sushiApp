import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductById = async (id: string): Promise<IProduct | null> => {
  await db.connect();
  const promotion = await Product.findById(id).lean();
  await db.disconnect();
  if (!promotion) {
    return null;
  }

  return JSON.parse(JSON.stringify(promotion));
};

interface ProductSlugs {
  slug: string;
}
// export const getAllProductsSlugs = async (): Promise<ProductSlugs[]> => {
//   await db.connect();
//   const slugs = await Product.find({}).select("slug -_id").lean();
//   await db.disconnect();
//   return slugs;
// };

export const getAllProducts = async (): Promise<IProduct[]> => {
  db.connect();
  const products = await Product.find({})
    .select("title slug price inStock images -_id")
    .lean();
  db.disconnect();

  return JSON.parse(JSON.stringify(products));
};
export function getPromotionById(arg0: string) {
  throw new Error("Function not implemented.");
}
