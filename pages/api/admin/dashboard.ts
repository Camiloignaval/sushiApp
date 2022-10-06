import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, User, Product } from "../../../models";

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number; //is paid true
      notPaidOrders: number;
      numberOfClients: number; // role:client
      numberOfProducts: number;
      productsWithNoInventory: number; // 0
      lowInventory: number; // productos con 10 o menos
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
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInventory,
    ] = await Promise.all([
      Order.count(),
      Order.find({ state: "ingested" }),
      Order.find({ state: "inprocess" }),
      Order.find({ state: "dispatched" }),
      Order.find({ state: "delivered" }),
      Order.find({ isPaid: true }).count(),
      User.find({ role: "client" }).count(),
      Product.count(),
      Product.find({ inStock: 0 }).count(),
      Product.find({ inStock: { $lte: 10 } }).count(),
    ]);

    await db.disconnect();

    res.status(200).json({
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInventory,
      notPaidOrders: numberOfOrders - paidOrders,
    });
  } catch (error) {
    console.log({ errorindashboard: error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
}
