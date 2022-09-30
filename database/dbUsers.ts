import bcrypt from "bcryptjs";

import { User } from "../models";
import { db } from "./";

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) {
      return null;
    }

    if (!bcrypt.compareSync(password, user.password!)) {
      return null;
    }

    const { role, name, _id } = user;

    return {
      _id,
      email: email.toLocaleLowerCase(),
      role,
      name,
    };
  } catch (error) {
    await db.disconnect();
    console.log({ errordbusers: error });
    return null;
  }
};

export const findUserByPhone = async (phone: string) => {
  try {
    console.log("entre a finduser");
    await db.connect();
    const user = await User.findOne({ phone });
    console.log({ user });
    await db.disconnect();
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    await db.disconnect();
    console.log({ errordbusers: error });
    return null;
  }
};
