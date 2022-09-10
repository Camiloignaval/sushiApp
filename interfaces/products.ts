export interface IProduct {
  _id?: string;
  image: string;
  name: string;
  inStock: boolean;
  price: number;
  type: IType;
  fillingType?: IFillingType;
  createdAt?: string;
  updatedAt?: string;
}

type IType = "envelope" | "filling" | "sauce" | "other";
type IFillingType = "protein" | "vegetable";
