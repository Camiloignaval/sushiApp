import { db } from ".";
import { ICategory, IProduct } from "../interfaces";
import { Category, Product, Promotion } from "../models";

export const getCategories = async (): Promise<ICategory[] | null> => {
  await db.connect();
  const categories = await Category.find().lean();
  await db.disconnect();
  // if (!categories) {
  //   return null;
  // }

  // product.images = product.images.map((image) => {
  //   return image.includes("http")
  //     ? image
  //     : `${process.env.HOST_NAME}products/${image}`;
  // });

  return JSON.parse(JSON.stringify(categories));
};
