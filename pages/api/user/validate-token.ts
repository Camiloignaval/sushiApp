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
  | {
      token: string;
      user: IUser;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return checkJWT(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies;

  let userId = "";

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token de autorizacion no es valido" });
  }

  await db.connect();

  const user = await User.findById(userId).lean();

  await db.disconnect();

  if (!user) {
    return res.status(400).json({
      message: "No existe usuario con el id dado",
    });
  }

  const { _id, name, role, phone } = user as IUser;

  res
    .status(200)
    .json({ token: jwt.signToken(_id!, phone), user: { role, name, phone } });
};
