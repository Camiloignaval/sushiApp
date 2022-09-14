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

  // product.images = product.images.map((image) => {
  //   return image.includes("http")
  //     ? image
  //     : `${process.env.HOST_NAME}products/${image}`;
  // });

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
