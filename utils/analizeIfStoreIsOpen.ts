import { ISettingsStore } from "./../interfaces/settings";
import { format, isAfter, isBefore } from "date-fns";
import esLocale from "date-fns/locale/es";

export const analizeIfStoreIsOpen = (settingsData: ISettingsStore) => {
  const today = format(new Date(), "EEEE", { locale: esLocale });
  const hourNow = format(new Date(), "HH:mm");
  const horaApertura = format(
    new Date((settingsData as any)[today].scheduleOpen),
    "HH:mm"
  );
  const horaCierre = format(
    new Date((settingsData as any)[today].scheduleClose),
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

  if (settingsData.forceOpen) {
    return true;
  }
  if (settingsData.forceClose) {
    return false;
  }

  if (isAfterOfOpen && isBeforeOfOpen) {
    return true;
  }
  return false;
};
