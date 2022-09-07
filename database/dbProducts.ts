import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";
import { linkConvert } from "../utils";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) {
    return null;
  }

  product.images = product.images.map((image) => {
    return image.includes("http")
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });

  return JSON.parse(JSON.stringify(product));
};

interface ProductSlugs {
  slug: string;
}
export const getAllProductsSlugs = async (): Promise<ProductSlugs[]> => {
  await db.connect();
  const slugs = await Product.find({}).select("slug -_id").lean();
  await db.disconnect();
  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  term = term.toString().toLowerCase();

  db.connect();
  const products = await Product.find({ $text: { $search: term } })
    .select("title slug price inStock images -_id")
    .lean();
  db.disconnect();

  const updatedProducts = linkConvert(products);

  return JSON.parse(JSON.stringify(updatedProducts));
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  db.connect();
  const products = await Product.find({})
    .select("title slug price inStock images -_id")
    .lean();
  db.disconnect();

  const updatedProducts = linkConvert(products);

  return JSON.parse(JSON.stringify(updatedProducts));
};
