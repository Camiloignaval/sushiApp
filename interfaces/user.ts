export interface IUser {
  _id?: string;
  name: string;
  password?: string;
  email: string;
  role: string;

  createdAt?: string;
  updatedAt?: string;
}
