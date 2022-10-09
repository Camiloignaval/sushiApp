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

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const findBills = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { startOfWeek = null } = req.query;
  console.log({ startOfWeek });
  try {
    if (!startOfWeek) throw new Error("No hay fecha a buscar");
    await db.connect();
    const expenseOfWeek = await Expense.findOne({ week: startOfWeek });
    await db.disconnect();
    return res.status(200).json(expenseOfWeek);
  } catch (error) {
    console.log({ errorinbills: error });
    await db.disconnect();
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
    console.log({ bills, week });
    await db.connect();
    await Expense.findOneAndUpdate(
      { week },
      { bills: bills },
      { upsert: true }
    );
    await db.disconnect();
    return res.status(200).json({ message: "Gastos actualizados" });
  } catch (error) {
    console.log({ errorinbills: error });
    await db.disconnect();
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
