import { IProduct } from "./../interfaces/products";
import { IOrder } from "./../interfaces/order";
import { ConectorPlugin } from "./conectorPlugin";
import { ConectorPluginV3 } from "./conectorPluginv3";
import { currency } from ".";
import { toast } from "react-hot-toast";
interface IProductCustomRoll {
  name?: string;
  price?: number;
  _id?: string;
}

// export const printOrder = async () => {
//   const nombreImpresora = "ImpresoraTermica"; // Puede ser obtenida de la lista de impresoras o puedes escribirlo si lo conoces
//   const conector = new ConectorPluginV3();
//   const respuesta = await conector
//     .Iniciar()
//     .EscribirTexto("Hola mundo")
//     .Feed(1)
//     .imprimirEn(nombreImpresora);
// };

export const printOrder = async (order: IOrder) => {
  const nombreImpresora = "ImpresoraTermica"; // Puede ser obtenida de la lista de impresoras o puedes escribirlo si lo conoces

  const conector = new ConectorPluginV3(process.env.HOST_NAME);
  const respuesta = await conector
    .Iniciar()
    .EstablecerTamañoFuente(2, 2)
    .EstablecerEnfatizado(true)
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
    .EscribirTexto("Sushi Panko\n")
    .Feed(2);

  // datos cliente
  conector
    .EstablecerEnfatizado(false)
    .EstablecerTamañoFuente(1, 1)
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
    .TextoSegunPaginaDeCodigos(
      2,
      "cp850",
      `Cliente: ${order.shippingAddress.username}\n`
    )
    .TextoSegunPaginaDeCodigos(
      2,
      "cp850",
      `Dirección: ${order.shippingAddress.address}\n`
    )
    .Feed(1);
  order.orderItems.forEach((item, i) => {
    console.log(i, item);
    conector
      .EstablecerEnfatizado(false)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto(`${item.quantity} ${item.name}\n`);
    if (item.name === "Roll personalizado") {
      // imprimir ingredientes
      // envoltura
      conector
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
        .EstablecerEnfatizado(true)
        .EscribirTexto(" -Envoltura: ");
      item.envelopes &&
        item.envelopes.map((i: IProductCustomRoll) => {
          conector
            .EstablecerEnfatizado(false)
            .TextoSegunPaginaDeCodigos(2, "cp850", `${i.name}\n`);
        });
      // relleno
      conector
        .EstablecerEnfatizado(true)
        .TextoSegunPaginaDeCodigos(2, "cp850", " -Relleno: ");
      if (item.proteins && item.vegetables) {
        const stringRelleno = [
          ...(item.proteins ?? []),
          ...(item.vegetables ?? []),
        ]
          .map((i) => i.name)
          .join("-");
        conector
          .EstablecerEnfatizado(false)
          .TextoSegunPaginaDeCodigos(2, "cp850", `${stringRelleno}\n`);
      }
      // extras
      if (item?.extraProduct) {
        conector
          .EstablecerEnfatizado(true)
          .TextoSegunPaginaDeCodigos(2, "cp850", " -Extras: ");
        const stringExtras = item.extraProduct
          .map((i: IProductCustomRoll) => i.name)
          .join("-");
        conector
          .EstablecerEnfatizado(false)
          .TextoSegunPaginaDeCodigos(2, "cp850", `${stringExtras}\n`);
      }
      // Salsas
      // TODO ARREGLAR
      conector.EstablecerEnfatizado(true).EscribirTexto(" -Salsas: ");
      if (item.sauces) {
        const stringRelleno = item.sauces
          .map((i: IProductCustomRoll) =>
            i?.name ? i.name.replace("Salsa de", "") : ""
          )
          .join("-");
        conector
          .EstablecerEnfatizado(false)
          .TextoSegunPaginaDeCodigos(2, "cp850", `${stringRelleno}\n`);
      }
    }
    if (item.note) {
      // notas
      conector
        .EstablecerEnfatizado(true)
        .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
        .TextoSegunPaginaDeCodigos(2, "cp850", `*${item?.note}*\n`);
    }
    conector.Feed(1);
  });

  // productos extras
  if (order?.orderExtraItems!.length > 0) {
    conector
      .EstablecerEnfatizado(false)
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
      .EscribirTexto(`Productos extra: \n`);
    order?.orderExtraItems?.map((ei) => {
      conector.TextoSegunPaginaDeCodigos(
        2,
        "cp850",
        ` ${ei.quantity} ${ei.name}\n`
      );
    });
  }
  conector.Feed(1);

  // total
  conector
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
    .EstablecerEnfatizado(true)
    .EscribirTexto("----------------------------\n")
    .EscribirTexto(`Total:${currency.format(Math.round(order.total))}`)
    .Feed(3)
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
    .EscribirTexto("***Gracias por su compra***\n")
    .Feed(1)
    .EstablecerEnfatizado(false)
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_DERECHA)
    .TextoSegunPaginaDeCodigos(2, "cp850", `N° ${order._id!.slice(-10)}`)
    .Feed(1)
    // .Corte()
    // .CorteParcial()
    // .Pulso(120)
    .imprimirEn(nombreImpresora);
  if (respuesta) {
    console.log("Impreso correctamente", JSON.stringify(respuesta));
  } else {
    console.log("Error: " + JSON.stringify(respuesta));
  }
};

export const printIsConnected = async () => {
  const resp = await ConectorPlugin.obtenerImpresoras();
  if (resp.includes("ImpresoraTermica")) {
    return false;
  }
  return true;
};
