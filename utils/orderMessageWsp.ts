import { IOrder } from "./../interfaces/order";
export const orderMessageWsp = (order: IOrder) => {
  const message = [
    `Hola ${
      order.shippingAddress.username.split(" ")[0]
    }!\nTu orden ha sido recibida.\n\n`,
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

          .map((i) => {
            return ` ${i.qty!} ${i.name}`;
          })
          .join(" -");
        message.push(`${stringRelleno}\n`);
      }
      // extras
      if (item?.extraProduct) {
        message.push(" -Extras: ");
        const stringExtras = item.extraProduct
          .map((i) => ` ${i.qty!} ${i.name}`)
          .join(" -");
        message.push(`${stringExtras}\n`);
      }
      // Salsas
      message.push(" -Salsas: ");
      // todo arreglar
      if (item.sauces) {
        const stringRelleno = item.sauces
          .map((i) => ` ${i.qty!} ${i.name}`)
          .join(" -");
        message.push(`${stringRelleno}\n`);
      }
    } else {
      if ((item.sauces?.length ?? []) > 0) {
        message.push(" -Salsas: ");
        // todo arreglar
        if (item.sauces) {
          const stringSauces = item.sauces
            .map((i) => ` ${i.qty!} ${i.name}`)
            .join(" -");
          message.push(`${stringSauces}\n`);
        }
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
  message.push(`TOTAL: ${order.total}\n\n`);
  message.push(
    `\nPuedes ver la información y estado de tu pedido en el siguiente link: ${process.env.HOST_NAME}/order/${order._id}`
  );
  return message.join("");
};
