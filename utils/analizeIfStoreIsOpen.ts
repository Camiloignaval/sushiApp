import { ISettingsStore } from "./../interfaces/settings";
import { format, isAfter, isBefore } from "date-fns";
import esLocale from "date-fns/locale/es";
import { storeOpen } from "../store/Slices/UISlice";
import { removeAccents } from "./removeAccents";

export const analizeIfStoreIsOpen = (settingsData: ISettingsStore) => {
  const today = removeAccents(format(new Date(), "EEEE", { locale: esLocale }));
  const hourNow = format(new Date(), "HH:mm");
  const horaApertura = format(
    new Date((settingsData as any)[today]?.scheduleOpen),
    "HH:mm"
  );
  const horaCierre = format(
    new Date((settingsData as any)[today]?.scheduleClose),
    "HH:mm"
  );

  const isAfterOfOpen = isAfter(
    new Date(`2022-06-06 ${hourNow}`),
    new Date(`2022-06-06 ${horaApertura}`)
  );
  const isBeforeOfOpen = isBefore(
    new Date(`2022-06-06 ${hourNow}`),
    new Date(`2022-06-06 ${horaCierre}`)
  );
  if (settingsData.forceOpen === true) {
    return { type: "open", isOpen: true };
  }
  if (settingsData.forceClose === true || !(settingsData as any)[today].open) {
    return { type: "close", isOpen: false };
  }

  if ((settingsData as any)[today].open) {
    if (isAfterOfOpen && isBeforeOfOpen) {
      return { type: "open", isOpen: true };
    }
  }

  return { type: "soon", isOpen: false };
};
