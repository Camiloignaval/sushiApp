import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt, validations } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
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
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { email = "", password = "", name = "" } = req.body;
  // cambiar validacion por zxcvbn
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe ser de almenos 6 caracteres" });
  }
  if (name.trim().split(" ").length < 2) {
    return res
      .status(400)
      .json({ message: "Debe ingresar almenos primer nombre y apellido" });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: "Correo invalido" });
  }

  await db.connect();
  const user = await User.findOne({ email });
  // await db.disconnect();

  if (user) {
    return res.status(400).json({
      message: "Correo ya registrado",
    });
  }

  //   if all is validated
  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Revisar logs del servidor",
    });
  }

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);

  res.status(200).json({ token, user: { role, name, email } });
};
