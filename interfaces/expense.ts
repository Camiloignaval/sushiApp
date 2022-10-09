export interface IExpense {
  _id?: string;
  week: string;
  bills: IBills[];
  gains?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBills {
  expense: number;
  name: string;
}
