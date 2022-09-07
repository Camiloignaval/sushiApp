export interface IProduct {
  _id?: string;
  image: string;
  inStock: boolean;
  price: number;
  type: IType;
  fillingType: IFillingType;
  createdAt?: string;
  updatedAt?: string;
}

type IType = "envelope" | "filling" | "sauce";
type IFillingType = "protein" | "vegetable";
