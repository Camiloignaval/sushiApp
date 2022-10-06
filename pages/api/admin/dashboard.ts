import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, User, Product, Promotion } from "../../../models";

type Data =
  | {
      numberOfOrders: number;
      numberOfOrdersIngresadas: number;
      numberOfOrdersEnProceso: number;
      numberOfOrdersDespachadas: number;
      numberOfOrdersEntregadas: number;
      numberOfClients: number; // role:client
      numberOfProducts: number;
      numberOfPromotions: number;
      productsWithNoInventory: number; // 0
      promotionsWithNoInventory: number;
    }
  | {
      message: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await db.connect();

    const [
      numberOfOrders,
      numberOfOrdersIngresadas,
      numberOfOrdersEnProceso,
      numberOfOrdersDespachadas,
      numberOfOrdersEntregadas,
      numberOfClients,
      numberOfProducts,
      numberOfPromotions,
      productsWithNoInventory,
      promotionsWithNoInventory,
    ] = await Promise.all([
      Order.count(),
      Order.find({ status: "ingested" }).count(),
      Order.find({ status: "inprocess" }).count(),
      Order.find({ status: "dispatched" }).count(),
      Order.find({ status: "delivered" }).count(),
      User.find({ role: "client" }).count(),
      Product.count(),
      Promotion.count(),
      Product.find({ inStock: false }).count(),
      Promotion.find({ inStock: false }).count(),
    ]);

    await db.disconnect();

    res.status(200).json({
      numberOfOrders,
      numberOfOrdersIngresadas,
      numberOfOrdersEnProceso,
      numberOfOrdersDespachadas,
      numberOfOrdersEntregadas,
      numberOfClients,
      numberOfProducts,
      numberOfPromotions,
      productsWithNoInventory,
      promotionsWithNoInventory,
    });
  } catch (error) {
    console.log({ errorindashboard: error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
}
