import { endOfDay, startOfDay } from "date-fns";
import { IOrder } from "./../../../interfaces/order";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, User, Product, Promotion } from "../../../models";

type Data =
  | {
      ganancias: [any];
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
    const { startDate = undefined, endDate = undefined } = req.query;
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = startOfDay(
      startDate ? new Date(startDate as string) : new Date(curr.setDate(first))
    );
    var lastday = endOfDay(
      endDate ? new Date(endDate as string) : new Date(curr.setDate(last))
    );
    console.log({ firstday, lastday });

    // hay que cambiar ganancias por aggregaciones

    const [
      ganancias,
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
      // TODO cambiar updatedAt por paidDate (crear)
      Order.find({
        status: "delivered",
        updatedAt: {
          $gte: firstday,
          $lt: lastday,
        },
      }).select("total deliverPrice discount"),
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
      ganancias,
    });
  } catch (error) {
    console.log({ errorindashboard: error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
}
