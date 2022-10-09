export interface IExpense {
  _id?: string;
  week: string;
  bills: IBills[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IBills {
  expense: number;
  name: string;
}
