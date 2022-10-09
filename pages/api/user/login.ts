import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        userName: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userName = "", password = "" } = req.body;

  try {
    await db.connect();
    const user = await User.findOne({ userName });
    // await db.disconnect();

    if (!user) {
      return res.status(400).json({
        message: "Correo o contraseña no válidos",
      });
    }

    if (!user?.password || user.role === "client")
      throw new Error("Usuario sin acceso");

    if (!bcrypt.compareSync(password, user.password!)) {
      return res.status(400).json({
        message: "Correo o contraseña no válidos",
      });
    }
    const { role, name, _id } = user;

    const token = jwt.signToken(_id, userName, role);

    res.status(200).json({ token, user: { role, name, userName } });
  } catch (error) {
    // await db.disconnect();
    console.log({ error });
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "Error desconocido" });
    }
  }
};
