import { startOfDay } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IExpense } from "../../../interfaces";
import Expense from "../../../models/Bills";

type Data =
  | {
      message: string;
    }
  | IExpense
  | null;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return findBills(req, res);
    case "PUT":
      return updateBills(req, res);
    case "POST":
      return closeWeek(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const findBills = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { startOfWeek = null } = req.query;
  try {
    if (!startOfWeek) throw new Error("No hay fecha a buscar");
    await db.connect();
    const expenseOfWeek = await Expense.findOne({ week: startOfWeek });
    // await db.disconnect();
    return res.status(200).json(expenseOfWeek);
  } catch (error) {
    console.log({ errorinbills: error });
    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
const updateBills = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { bills, week } = req.body;
  try {
    await db.connect();
    await Expense.findOneAndUpdate(
      { week },
      { bills: bills },
      { upsert: true }
    );
    // await db.disconnect();
    return res.status(200).json({ message: "Gastos actualizados" });
  } catch (error) {
    console.log({ errorinbills: error });
    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};

function getMonday() {
  const d = new Date();
  const day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return startOfDay(new Date(d.setDate(diff)));
}
const closeWeek = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const gains = req.body;
  try {
    const firstOfActualWeek = getMonday();

    await db.connect();
    await Expense.findOneAndUpdate(
      { week: firstOfActualWeek },
      { gains: gains },
      { upsert: true }
    );
    // await db.disconnect();
    return res.status(200).json({ message: "Ganancias actualizadas" });
  } catch (error) {
    console.log({ errorinbills: error });
    // await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
