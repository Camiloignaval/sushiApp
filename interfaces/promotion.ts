import { ICategory } from "./category";
import { IProduct } from "./products";
export interface IPromotion {
  promotionItems: string[];
  price: number;
  inOffer: boolean;
  inStock: boolean;
  description: string;
  images: string[];
  name: string;
  offerPrice?: number;
  category: ICategory;
  quantity: number;
  unit: string;
  importanceNumber: string;
  includesSauces: IProduct[];
  qtySauces: number;

  _id?: string;
}

export type IUnit = "Piezas" | "Porciones" | "Rolls";
