import { db } from ".";
import { ICategory } from "../interfaces";
import { Category } from "../models";

export const getCategories = async (): Promise<ICategory[] | null> => {
  try {
    await db.connect();
    const categories = await Category.find()
      .sort({ importanceNumber: -1, createdAt: 1 })
      .lean();
    // await db.disconnect();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.log({ errordbcategories: error });

    // await db.disconnect();
    return JSON.parse(JSON.stringify([]));
  }
};
