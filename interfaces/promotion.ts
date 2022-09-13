import { ICategory } from "./category";
export interface IPromotion {
  promotionItems: string[];
  price: number;
  inOffer: boolean;
  inStock: boolean;
  description: string;
  images: string[];
  name: string;
  lastPrice?: number;
  category: ICategory;
  quantity: number;
  unit: string;
  _id?: string;
}

export type IUnit = "Piezas" | "Porciones" | "Rolls";
