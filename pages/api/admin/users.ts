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

    case "PUT":
      return updateUser(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const users = await User.find().select("-password").lean();
    await db.disconnect();
    return res.status(200).json(users);
  } catch (error) {
    console.log({ errorinuser: error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = "", role = "" } = req.body;

  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Id de usuario no es valido" });
    }

    const validRoles = ["admin", "client", "SEO", "super-user"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol no permitido" });
    }

    await db.connect();
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Usuario no existe en registros" });
    }

    await User.findOneAndUpdate({ _id: userId }, { role });
    await db.disconnect();
    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    console.log({ errorinuser: error });
    await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
