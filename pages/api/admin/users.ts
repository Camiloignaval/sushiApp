import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const users = await User.find({ role: "client" })
      .select("-password")
      .lean();

    // await db.disconnect();
    return res.status(200).json(users);
  } catch (error) {
    console.log({ errorinuser1: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
