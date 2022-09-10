import { ICategory } from "./category";
export interface IPromotion {
  promotionItems: String[];
  price: Number;
  inOffer: Boolean;
  inStock: Boolean;
  description: String;
  images: String[];
  name: String;
  lastPrice?: number;
  category: ICategory;
  quantity: Number;
  unit: String;
  _id?: String;
}

export type IUnit = "Piezas" | "Porciones" | "Rolls";
