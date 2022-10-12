import bcrypt from "bcryptjs";
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
      return getAdmins(req, res);

    case "PUT":
      return updateUser(req, res);
    case "POST":
      return newUser(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getAdmins = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const users = await User.find({
      role: { $in: ["admin", "delivery", "superadmin"] },
    })
      .select("-password")
      .lean();

    // await db.disconnect();
    console.log({ users });
    return res.status(200).json(users);
  } catch (error) {
    console.log({ errorinuser1: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userName = "", phone = "", _id } = req.body;
  const body = req.body;

  try {
    if (!isValidObjectId(_id)) {
      return res.status(400).json({ message: "Id de usuario no es valido" });
    }

    await db.connect();
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Id no existe en registros" });
    }
    if (user && user?.id !== _id) {
      return res
        .status(400)
        .json({ message: "Teléfono ya pertenece a otro usuario" });
    }

    if (body.password) {
      body.password = bcrypt.hashSync(body.password);
      console.log({ pas: body.password });
    }
    await User.findOneAndUpdate({ _id }, body);
    await db.disconnect();
    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    console.log({ errorinuser2: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
const newUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userName = "", phone = "", password } = req.body;
  const body = req.body;
  body.address = "Sin dirección";
  body.password = bcrypt.hashSync(password);
  try {
    await db.connect();
    const userWithUserName = await User.findOne({ userName });
    const userWithPhone = await User.findOne({ phone });
    if (userWithUserName) {
      return res.status(400).json({ message: "UserName no disponible" });
    }
    if (userWithPhone) {
      return res.status(400).json({ message: "Teléfono ya registrado" });
    }

    const user = new User(body);
    await user.save();
    res.status(200).json({ message: "Usuario creado" });
  } catch (error) {
    console.log({ errorinuser2: error });
    // await db.disconnect();
    res.status(500).json({ message: "Algo ha salido mal..." });
  }
};
