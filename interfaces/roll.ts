export interface IRoll {
  _id?: string;
  image: string;
  inStock: boolean;
  price: number;
  type: IType;
  fillingType: IFillingType;
  createdAt?: string;
  updatedAt?: string;
}

type IType = "envelope" | "filling" | "sauce" | "other";
type IFillingType = "protein" | "vegetable";
