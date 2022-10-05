import { ISettingsStore } from "./../interfaces/settings";
import { db } from ".";
import { IProduct, IPromotion } from "../interfaces";
import { Product, Promotion } from "../models";
import Settings from "../models/Settings";

export const getSettings = async (): Promise<ISettingsStore | null> => {
  try {
    await db.connect();
    const settings = await Settings.find();
    await db.disconnect();
    if (!settings[0]) {
      return null;
    }
    return JSON.parse(JSON.stringify(settings[0]));
  } catch (error) {
    await db.disconnect();
    console.log({ errordbsettings: error });
    return null;
  }
};
