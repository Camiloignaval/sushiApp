import esLocale from "date-fns/locale/es";
import { addHours, format, isBefore, isDate, isAfter, isValid } from "date-fns";
import { ISettingsStore } from "../interfaces";
import { removeAccents } from "./removeAccents";

export const analizeIfIsPossibleReserve = (
  settingsData: ISettingsStore,
  hour: string
) => {
  if (!isValid(new Date(hour))) {
    return {
      value: false,
      message: "Formato incorrecto de Fecha/hora",
    };
  }
  if (isBefore(new Date(hour), new Date())) {
    return {
      value: false,
      message: "Está intentando ingresar una fecha pasada",
    };
  }
  const dayToAnalize = removeAccents(
    format(new Date(hour), "EEEE", { locale: esLocale })
  );
  const hourToAnalize = format(new Date(hour), "HH:mm");

  if ((settingsData as any)[dayToAnalize]?.open === false) {
    return {
      value: false,
      message: `Día ${dayToAnalize} tienda se encuentra cerrada`,
    };
  }
  //   le sumaremos 1 hora desde la apertura
  const horaApertura = format(
    addHours(new Date((settingsData as any)[dayToAnalize]?.scheduleOpen), 1),
    "HH:mm"
  );
  const horaCierre = format(
    new Date((settingsData as any)[dayToAnalize]?.scheduleClose),
    "HH:mm"
  );
  const isAfterOfOpen = isAfter(
    new Date(`2022-06-06 ${hourToAnalize}`),
    new Date(`2022-06-06 ${horaApertura}`)
  );
  const isBeforeOfClose = isBefore(
    new Date(`2022-06-06 ${hourToAnalize}`),
    new Date(`2022-06-06 ${horaCierre}`)
  );
  if (!isAfterOfOpen) {
    return {
      value: false,
      message: `Orden se puede agendar mínimo 1 hora después de la apertura (${horaApertura} para el día ${dayToAnalize})`,
    };
  }
  if (!isBeforeOfClose) {
    return {
      value: false,
      message: `Orden se puede agendar máximo a las ${horaCierre} para el día ${dayToAnalize})`,
    };
  }
  // Que pida minimo con 2 horas de anticipacion
  if (isBefore(new Date(hour), addHours(new Date(), 2))) {
    return {
      value: false,
      message: `Favor pedir con un mínimo de 2 horas de anticipacion`,
    };
  }

  return {
    value: true,
    message: "Sin problemas",
  };
};
