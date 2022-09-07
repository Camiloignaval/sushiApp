export interface IPromotion {
  promotionItems: String[];
  price: Number;
  inOffer: Boolean;
  inStock: Boolean;
  description: String;
  images: String[];
  name: String;
  _id?: String;
}
