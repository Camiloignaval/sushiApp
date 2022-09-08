export interface ICartProduct {
  _id: String;
  image: String;
  price: Number;
  name: String;
  quantity: Number;
  extraProduct: IExtraProduct[];
  note?: String;
}

export interface IExtraProduct {
  _id: String;
  image: String;
  price: Number;
  name: String;
  quantity: number;
}
