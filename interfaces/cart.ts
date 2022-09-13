import { IProduct } from "./products";
export interface ICartProduct {
  _id?: string;
  image: string;
  price: number;
  name: string;
  quantity: number;
  extraProduct?: IProduct[];
  proteins?: IProduct[];
  vegetables?: IProduct[];
  sauces?: IProduct[];
  envelopes?: IProduct[];
  note?: string;
  type?: string;
  inStock?: boolean;
}

// export interface IExtraProduct {
//   _id?: String;
//   image: String;
//   price: Number;
//   name: String;
//   quantity: number;
// }
