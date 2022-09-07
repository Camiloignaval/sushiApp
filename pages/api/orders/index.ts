import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { IOrder, IProduct } from "../../../interfaces";
import { Order, Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createNewOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}
const createNewOrder = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { orderItems, total } = req.body as IOrder;

  //Verificar que tengamos un usuario

  const session: any = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ message: "Debe estar autenticado para realizar una orden" });
  }

  //   crear un arreglo con los productos que la persona quiere
  const productsIds = orderItems.map((p) => p._id);
  db.connect();
  const dbProduct = await Product.find({ _id: { $in: productsIds } });
  try {
    const subTotal = orderItems.reduce((acc, curr) => {
      const currentPrice = dbProduct.find(
        (prod) => prod.id === curr._id
      )?.price;
      if (!currentPrice) {
        throw new Error("Verifique carrito, producto no existe");
      }
      return acc + currentPrice * curr.quantity;
    }, 0);
    const tax =
      (subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)) / 100;
    const backendTotal = subTotal + tax;

    if (backendTotal !== total) {
      throw new Error("El total no cuadra con monto enviado");
    }

    // si todo sale bien crear orden
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    await newOrder.save();
    newOrder.total = Number(newOrder.total.toFixed(2));
    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
