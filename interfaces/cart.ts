import { IProduct } from "./products";
export interface ICartProduct {
  _id?: String;
  image: String;
  price: Number;
  name: String;
  quantity: Number;
  extraProduct?: IProduct[];
  proteins?: IProduct[];
  vegetables?: IProduct[];
  sauces?: IProduct[];
  envelopes?: IProduct[];
  note?: String;
}

// export interface IExtraProduct {
//   _id?: String;
//   image: String;
//   price: Number;
//   name: String;
//   quantity: number;
// }
