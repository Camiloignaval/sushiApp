import { ExtraProducts } from "./../components/customRoll/ExtraProducts";
export interface ISettingsStore {
  _id?: string;
  lunes: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  martes: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  miercoles: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  jueves: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  viernes: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  sabado: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  domingo: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  forceClose: boolean;
  forceOpen: boolean;
  kmPrice: number;
  customRoll: {
    proteins: number;
    vegetables: number;
    sauces: number;
    extraProducts: number;
  };
}
