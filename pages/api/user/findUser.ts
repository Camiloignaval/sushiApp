import { IUser } from "./../../../interfaces/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | IUser;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return findUser(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const findUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { phone = "" } = req.body;
    await db.connect();
    const user = await User.findOne({ phone: phone }).select(
      " phone address name placeId -_id"
    );
    // await db.disconnect();

    if (!user) {
      return res.status(400).json({
        message: "No existe usuario con el id dado",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    // await db.disconnect();

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
