import { IOrder } from "./../interfaces/order";
export const orderMessageWsp = (order: IOrder) => {
  const message = [
    `Hola ${order.shippingAddress.username}!\nTu orden ha sido recibida.\n\n`,
  ];

  order.orderItems.forEach((item) => {
    message.push(`${item.quantity} ${item.name}\n`);
    if (item.name === "Roll personalizado") {
      // imprimir ingredientes

      message.push(" -Envoltura: ");
      item.envelopes &&
        item.envelopes.map((i) => {
          message.push(`${i.name}\n`);
        });
      // relleno
      message.push(" -Relleno: ");
      if (item.proteins && item.vegetables) {
        const stringRelleno = [
          ...(item.proteins ?? []),
          ...(item.vegetables ?? []),
        ]
          .map((i) => i.name)
          .join("-");
        message.push(`${stringRelleno}\n`);
      }
      // extras
      if (item?.extraProduct) {
        message.push(" -Extras: ");
        const stringExtras = item.extraProduct.map((i) => i.name).join("-");
        message.push(`${stringExtras}\n`);
      }
      // Salsas
      message.push(" -Salsas: ");
      if (item.sauces) {
        const stringRelleno = item.sauces
          .map((i) => (i?.name ? i.name.replace("Salsa de", "") : ""))
          .join("-");
        message.push(`${stringRelleno}\n`);
      }
    }
    if (item?.note) {
      // notas
      message.push(`  *Nota:*`);
      message.push(` ${item?.note}\n`);
    }
  });

  // productos extras
  if (order?.orderExtraItems!?.length > 0) {
    message.push(`Productos extra: \n`);
    order?.orderExtraItems?.map((ei) => {
      message.push(` ${ei.quantity} ${ei.name}\n`);
    });
  }
  message.push(
    `\nPuedes ver el estado de tu pedido en el sieuignte link: ${process.env.HOST_NAME}/order/${order._id}`
  );
  return message.join("");
};
