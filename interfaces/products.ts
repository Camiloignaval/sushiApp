export interface IProduct {
  _id?: string;
  image: string;
  name: string;
  inStock: boolean;
  price: number;
  type: IType;
  qty?: number;
  fillingType?: IFillingType;
  createdAt?: string;
  updatedAt?: string;
}

export type IType = "envelope" | "filling" | "sauce" | "other";
export type IFillingType = "protein" | "vegetable";
