import { ISettingsStore } from "./../interfaces/settings";
import { db } from ".";
import { IProduct, IPromotion } from "../interfaces";
import { Product, Promotion } from "../models";
import Settings from "../models/Settings";

export const getSettings = async (): Promise<ISettingsStore | null> => {
  try {
    await db.connect();
    const settings = await Settings.findOne({});
    await db.disconnect();
    if (!settings) {
      return null;
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    await db.disconnect();
    console.log({ errordbsettings: error });
    return null;
  }
};
