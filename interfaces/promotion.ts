export interface IPromotion {
  promotionItems: String[];
  price: Number;
  inOffer: Boolean;
  inStock: Boolean;
  description: String;
  images: String[];
  name: String;
  lastPrice?: number;
  category: String;
  quantity: Number;
  unit: String;
  _id?: String;
}

export type ICategory = "Promos" | "HandRolls";
export type IUnit = "Piezas" | "Porciones" | "Rolls";
