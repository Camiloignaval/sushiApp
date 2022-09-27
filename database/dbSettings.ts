import { ISettingsStore } from "./../interfaces/settings";
import { db } from ".";
import { IProduct, IPromotion } from "../interfaces";
import { Product, Promotion } from "../models";
import Settings from "../models/Settings";

export const getSettings = async (): Promise<ISettingsStore | null> => {
  await db.connect();
  const settings = await Settings.findOne({});
  await db.disconnect();
  if (!settings) {
    return null;
  }
  return JSON.parse(JSON.stringify(settings));
};
