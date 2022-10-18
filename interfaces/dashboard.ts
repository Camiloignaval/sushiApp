import { IExpense } from "./expense";
export interface IDashboard {
  numberOfOrders: Number;
  numberOfOrdersIngresadas: Number;
  numberOfOrdersEnProceso: Number;
  numberOfOrdersDespachadas: Number;
  numberOfOrdersEntregadas: Number;
  numberOfClients: Number; // role:client
  numberOfNewClients: Number; // role:client
  numberOfProducts: Number;
  numberOfPromotions: Number;
  productsWithNoInventory: Number; // 0
  promotionsWithNoInventory: Number;
  ganancias: number;
  inByDelivery: number;
  discount: number;
  inTotal: number;
  avgTime: number;
  bills: number;
  dataGrafico: IExpense[];
}
