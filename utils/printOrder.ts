import { IProduct } from "./../interfaces/products";
import { IOrder } from "./../interfaces/order";
import { ConectorPlugin } from "./conectorPlugin";
import { currency } from ".";
import { toast } from "react-hot-toast";
import { connector_plugin } from "./plugin_impresora_abraza";
interface IProductCustomRoll {
  name?: string;
  price?: number;
  _id?: string;
}

// export const printOrder = async () => {
//   let nombreImpresora = "ImpresoraTermica";
//   let api_key = "12345";

//   const conector = new connector_plugin();
//   conector.fontsize("2");
//   conector.textaling("center");
//   conector.text("Ferreteria Angel");
//   conector.fontsize("1");
//   conector.text("Calle de las margaritas #45854");
//   conector.text("PEC7855452SCC");
//   conector.feed("3");
//   conector.textaling("left");
//   conector.text("Fecha: Miercoles 8 de ABRIL 2022 13:50");
//   conector.text("Cant.       Descripcion      Importe");
//   conector.text("------------------------------------------");
//   conector.text("1- Barrote 2x4x8                    $110");
//   conector.text("3- Esquinero Vinil                  $165");
//   conector.feed("1");
//   conector.fontsize("2");
//   conector.textaling("center");
//   conector.text("Total: $275");
//   conector.qr("https://abrazasoft.com");
//   conector.feed("5");
//   conector.cut("0");

//   const resp = await conector.imprimir(nombreImpresora, api_key);
//   if (resp === true) {
//   } else {
//     console.log("Problema al imprimir: " + resp);
//   }
// };

export const printOrder = async (order: IOrder) => {
  const conector = new ConectorPlugin();
  console.log({ order });
  conector
    .establecerTamanioFuente(2, 2)
    .establecerEnfatizado(1)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .textoConAcentos("Sushi Panko\n")
    .feed(2);

  // datos cliente
  conector
    .establecerEnfatizado(0)
    .establecerTamanioFuente(1, 1)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
    .textoConAcentos(`Cliente: ${order.shippingAddress.username}\n`)
    .textoConAcentos(`Direccion: ${order.shippingAddress.address}\n`)
    .feed(1);
  order.orderItems.forEach((item) => {
    conector
      .establecerEnfatizado(0)
      .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
      .textoConAcentos(`${item.quantity} ${item.name}\n`);
    if (item.name === "Roll personalizado") {
      // imprimir ingredientes
      // envoltura
      conector
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .establecerEnfatizado(1)
        .textoConAcentos(" -Envoltura: ");
      item.envelopes &&
        item.envelopes.map((i: IProductCustomRoll) => {
          conector.establecerEnfatizado(0).textoConAcentos(`${i.name}\n`);
        });
      // relleno
      conector.establecerEnfatizado(1).textoConAcentos(" -Relleno: ");
      if (item.proteins && item.vegetables) {
        const stringRelleno = [
          ...(item.proteins ?? []),
          ...(item.vegetables ?? []),
        ]
          .map((i) => i.name)
          .join("-");
        conector.establecerEnfatizado(0).textoConAcentos(`${stringRelleno}\n`);
      }
      // extras
      if (item?.extraProduct) {
        conector.establecerEnfatizado(1).textoConAcentos(" -Extras: ");
        const stringExtras = item.extraProduct
          .map((i: IProductCustomRoll) => i.name)
          .join("-");
        conector.establecerEnfatizado(0).textoConAcentos(`${stringExtras}\n`);
      }
      // Salsas
      conector.establecerEnfatizado(1).textoConAcentos(" -Salsas: ");
      if (item.sauces) {
        const stringRelleno = item.sauces
          .map((i: IProductCustomRoll) =>
            i?.name ? i.name.replace("Salsa de", "") : ""
          )
          .join("-");
        conector.establecerEnfatizado(0).textoConAcentos(`${stringRelleno}\n`);
      }
    }
    if (item?.note) {
      // notas
      conector
        .establecerEnfatizado(1)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .textoConAcentos(`*${item?.note}*\n`);
    }
    conector.feed(1);
  });

  // productos extras
  if (order?.orderExtraItems!.length > 0) {
    conector
      .establecerEnfatizado(0)
      .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
      .texto(`Productos extra: \n`);
    order?.orderExtraItems?.map((ei) => {
      conector.texto(` ${ei.quantity} ${ei.name}\n`);
    });
  }
  conector.feed(1);

  // total
  conector
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionDerecha)
    .establecerEnfatizado(1)
    .textoConAcentos("----------------------------\n")
    .textoConAcentos(`Total:${currency.format(Math.round(order.total))}`)
    .feed(3)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
    .textoConAcentos("***Gracias por su compra***\n")
    .feed(1)
    .establecerEnfatizado(0)
    .establecerJustificacion(ConectorPlugin.Constantes.AlineacionDerecha)
    .texto(`N° ${order._id!.slice(-10)}`)
    .feed(1)
    .cortar()
    .cortarParcialmente()
    .imprimirEn("ImpresoraTermica")
    .then((respuestaAlImprimir) => {
      if (respuestaAlImprimir === true) {
        console.log("Impreso correctamente");
      } else {
        console.log("Error. La respuesta es: " + respuestaAlImprimir);
      }
    });
};

export const printIsConnected = async () => {
  const resp = await ConectorPlugin.obtenerImpresoras();
  if (resp.includes("ImpresoraTermica")) {
    return false;
  }
  return true;
};
