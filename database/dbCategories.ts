import { db } from ".";
import { ICategory } from "../interfaces";
import { Category } from "../models";

export const getCategories = async (): Promise<ICategory[] | null> => {
  await db.connect();
  const categories = await Category.find().lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify(categories));
};
