import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { IOrder } from "./../../../interfaces/order";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, User, Product, Promotion } from "../../../models";
import Expense from "../../../models/Bills";
import { IExpense } from "../../../interfaces/expense";

type Data =
  | {
      bills: number;
      ganancias: number;
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
      numberOfNewClients: number;
      inByDelivery: number;
      discount: number;
      inTotal: number;
      avgTime: number;
      dataGrafico: IExpense[];
    }
  | {
      message: string;
    };

function getMonday() {
  const d = new Date();
  const day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return startOfDay(new Date(d.setDate(diff)));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await db.connect();
    const { startDate = undefined, endDate = undefined } = req.query;

    const firstOfActualWeek = getMonday();
    const lastOfActalWeek = endOfDay(addDays(firstOfActualWeek, 6));

    var firstdayToFilter = startOfDay(
      startDate ? new Date(startDate as string) : firstOfActualWeek
    );
    var lastdayToFilter = endOfDay(
      endDate ? new Date(endDate as string) : lastOfActalWeek
    );

    const filterByDate = {
      $gte: firstdayToFilter,
      $lt: lastdayToFilter,
    };

    // hay que cambiar ganancias por aggregaciones
    const [
      billOfWeek,
      orderWithOutReserve,
      ganancias,
      gananciasSemenales,
      numberOfOrders,
      numberOfOrdersIngresadas,
      numberOfOrdersEnProceso,
      numberOfOrdersDespachadas,
      numberOfOrdersEntregadas,
      numberOfClients,
      numberOfNewClients,
      numberOfProducts,
      numberOfPromotions,
      productsWithNoInventory,
      promotionsWithNoInventory,
      dataGrafico,
    ] = await Promise.all([
      Expense.findOne({ week: firstOfActualWeek }),
      Order.find({
        status: "delivered",
        createdAt: filterByDate,
        reservedHour: { $exists: false },
      }).select(
        "total deliverPrice discount createdAt paidAt reservedHour updatedAt"
      ),
      Order.find({
        status: "delivered",
        // TODO buscar si tiene reserverHour filtrar por eso, sino por createdAt
        createdAt: filterByDate,
      }).select(
        "total deliverPrice discount createdAt paidAt reservedHour updatedAt"
      ),
      Order.find({
        status: "delivered",
        // TODO buscar si tiene reserverHour filtrar por eso, sino por createdAt
        createdAt: {
          $gte: firstOfActualWeek,
          $lt: lastOfActalWeek,
        },
      }).select(
        "total deliverPrice discount createdAt paidAt reservedHour updatedAt"
      ),
      Order.find({ createdAt: filterByDate }).count(),
      Order.find({ status: "ingested", createdAt: filterByDate }).count(),
      Order.find({ status: "inprocess", updatedAt: filterByDate }).count(),
      Order.find({ status: "dispatched", updatedAt: filterByDate }).count(),
      Order.find({ status: "delivered", paidAt: filterByDate }).count(),
      User.find({ role: "client" }).count(),
      User.find({
        role: "client",
        updatedAt: filterByDate,
      }).count(),
      Product.count(),
      Promotion.count(),
      Product.find({ inStock: false }).count(),
      Promotion.find({ inStock: false }).count(),
      Expense.find().sort("week"),
    ]);

    // await db.disconnect();

    const weekBills = billOfWeek
      ? billOfWeek?.bills?.reduce((acc, curr) => acc + curr?.expense ?? 0, 0)
      : 0;

    const gananciasSemanales = gananciasSemenales.reduce(
      (acc: any, curr: any) => acc + curr.total,
      0
    );

    res.status(200).json({
      bills: weekBills,
      numberOfOrders,
      numberOfOrdersIngresadas,
      numberOfOrdersEnProceso,
      numberOfOrdersDespachadas,
      numberOfOrdersEntregadas,
      numberOfClients,
      numberOfNewClients,
      numberOfProducts,
      numberOfPromotions,
      productsWithNoInventory,
      promotionsWithNoInventory,
      ganancias: gananciasSemanales - weekBills,
      inByDelivery: ganancias.reduce(
        (acc: any, curr: any) => acc + curr.deliverPrice,
        0
      ),
      discount: ganancias.reduce(
        (acc: any, curr: any) => acc + curr?.discount,
        0
      ),
      inTotal: ganancias.reduce((acc: any, curr: any) => acc + curr.total, 0),
      avgTime: Math.round(
        orderWithOutReserve.reduce((acc: any, curr: any) => {
          const endTime = curr?.paidAt ?? curr?.updatedAt;
          const startTime = curr?.reservedHour ?? curr?.createdAt;
          const diff = Math.round(
            (new Date(endTime).getTime() - new Date(startTime).getTime()) /
              (1000 * 60)
          );

          return acc + diff;
        }, 0) / ganancias?.length
      ),
      dataGrafico,
    });
  } catch (error) {
    console.log({ errorindashboard: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
}
