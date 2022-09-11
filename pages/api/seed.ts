import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDataBase } from "../../database";
import { Product, User } from "../../models";
import Category from "../../models/Category";
import Coupon from "../../models/Coupon";
import Promotion from "../../models/Promotion";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({ message: "No tiene acceso a este servicio" });
  }

  await db.connect();
  await Coupon.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  await Promotion.deleteMany();
  await Category.deleteMany();
  await Coupon.insertMany(seedDataBase.initialData.coupons);
  await Category.insertMany(seedDataBase.initialData.categories);
  await Product.insertMany(seedDataBase.initialData.products);
  await User.insertMany(seedDataBase.initialData.users);
  await Promotion.insertMany(seedDataBase.initialData.promotions);
  await db.disconnect();

  res.status(200).json({ message: "Realizado con exito" });
}
