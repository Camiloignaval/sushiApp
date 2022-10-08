export interface IDashboard {
  numberOfOrders: Number;
  numberOfOrdersIngresadas: Number;
  numberOfOrdersEnProceso: Number;
  numberOfOrdersDespachadas: Number;
  numberOfOrdersEntregadas: Number;
  numberOfClients: Number; // role:client
  numberOfProducts: Number;
  numberOfPromotions: Number;
  productsWithNoInventory: Number; // 0
  promotionsWithNoInventory: Number;
  ganancias: [any];
}
