import { currency } from "./";

// export const Impresora = (() => {
/**
 * Una clase para interactuar con el plugin
 *
 * @author parzibyte
 * @see https://parzibyte.me/blog
 */
const C = {
  AccionWrite: "write",
  AccionCut: "cut",
  AccionCash: "cash",
  AccionCutPartial: "cutpartial",
  AccionAlign: "align",
  AccionFontSize: "fontsize",
  AccionFont: "font",
  AccionEmphasize: "emphasize",
  AccionFeed: "feed",
  AccionQr: "qr",
  AlineacionCentro: "center",
  AlineacionDerecha: "right",
  AlineacionIzquierda: "left",
  FuenteA: "A",
  FuenteB: "B",
  AccionBarcode128: "barcode128",
  AccionBarcode39: "barcode39",
  AccionBarcode93: "barcode93",
  AccionBarcodeEAN: "barcodeEAN",
  AccionBarcodeTwoOfFiveSinInterleaved: "barcodeTwoOfFive",
  AccionBarcodeTwoOfFiveInterleaved: "barcodeTwoOfFiveInterleaved",
  AccionBarcodeCodabar: "barcodeCodabar",
  AccionBarcodeUPCA: "barcodeUPCA",
  AccionBarcodeUPCE: "barcodeUPCE",
  Medida80: 80,
  Medida100: 100,
  Medida156: 156,
  Medida200: 200,
  Medida300: 300,
  Medida350: 350,
};

const URL_PLUGIN = "http://localhost:8000";

class OperacionTicket {
  constructor(accion, datos) {
    this.accion = accion + "";
    this.datos = datos + "";
  }
}
class Impresora {
  constructor(ruta) {
    if (!ruta) ruta = URL_PLUGIN;
    this.ruta = ruta;
    this.operaciones = [];
  }

  cut() {
    this.operaciones.push(new OperacionTicket(C.AccionCut, ""));
  }

  cash() {
    this.operaciones.push(new OperacionTicket(C.AccionCash, ""));
  }

  cutPartial() {
    this.operaciones.push(new OperacionTicket(C.AccionCutPartial, ""));
  }

  setFontSize(a, b) {
    this.operaciones.push(new OperacionTicket(C.AccionFontSize, `${a},${b}`));
  }

  setFont(font) {
    if (font !== C.FuenteA && font !== C.FuenteB)
      throw Error("Fuente inválida");
    this.operaciones.push(new OperacionTicket(C.AccionFont, font));
  }
  setEmphasize(val) {
    if (isNaN(parseInt(val)) || parseInt(val) < 0)
      throw Error("Valor inválido");
    this.operaciones.push(new OperacionTicket(C.AccionEmphasize, val));
  }
  setAlign(align) {
    if (
      align !== C.AlineacionCentro &&
      align !== C.AlineacionDerecha &&
      align !== C.AlineacionIzquierda
    ) {
      throw Error(`Alineación ${align} inválida`);
    }
    this.operaciones.push(new OperacionTicket(C.AccionAlign, align));
  }

  write(text) {
    this.operaciones.push(new OperacionTicket(C.AccionWrite, text));
  }

  feed(n) {
    if (!parseInt(n) || parseInt(n) < 0) {
      throw Error("Valor para feed inválido");
    }
    this.operaciones.push(new OperacionTicket(C.AccionFeed, n));
  }
  imprimirEnImpresora(nombreImpresora) {
    const payload = {
      operaciones: this.operaciones,
      impresora: nombreImpresora,
    };
    return fetch(this.ruta + "/imprimir_en", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.json());
  }

  end() {
    return fetch(this.ruta + "/imprimir", {
      method: "POST",
      body: JSON.stringify(this.operaciones),
    }).then((r) => r.json());
  }

  validarMedida(medida) {
    medida = parseInt(medida);
    if (
      medida !== C.Medida80 &&
      medida !== C.Medida100 &&
      medida !== C.Medida156 &&
      medida !== C.Medida200 &&
      medida !== C.Medida300 &&
      medida !== C.Medida350
    ) {
      throw Error("Valor para medida del barcode inválido");
    }
  }

  validarTipo(tipo) {
    if (
      [
        C.AccionBarcode128,
        C.AccionBarcode39,
        C.AccionBarcode93,
        C.AccionBarcodeEAN,
        C.AccionBarcodeTwoOfFiveInterleaved,
        C.AccionBarcodeTwoOfFiveSinInterleaved,
        C.AccionBarcodeCodabar,
        C.AccionBarcodeUPCA,
        C.AccionBarcodeUPCE,
      ].indexOf(tipo) === -1
    )
      throw Error("Tipo de código de barras no soportado");
  }
}

export const printOrderv1 = async (order) => {
  console.log({ order });
  const conector = new Impresora();
  conector.feed(2);
  conector.setFontSize(2, 2);
  conector.setEmphasize(1);
  conector.setAlign("center");
  conector.write("Sushi Panko\n");
  conector.feed(2);

  //   // datos cliente
  conector.setEmphasize(0);
  conector.setFontSize(1, 1);
  conector.setAlign("left");
  conector.write(`Cliente: ${order.shippingAddress.username}\n`);
  conector.write(`Direccion: ${order.shippingAddress.address}\n`);
  conector.feed(1);
  order.orderItems.forEach((item) => {
    conector.setEmphasize(0);
    conector.setAlign("left");
    conector.write(`${item.quantity} ${item.name}\n`);
    if (item.name === "Roll personalizado") {
      // imprimir ingredientes
      // envoltura
      conector.setAlign("left");
      conector.setEmphasize(1);
      conector.write(" -Envoltura: ");
      item.envelopes &&
        item.envelopes.map((i) => {
          conector.setEmphasize(0).write(`${i.name}\n`);
        });
      // relleno
      conector.setEmphasize(1).write(" -Relleno: ");
      if (item.proteins && item.vegetables) {
        const stringRelleno = [
          ...(item.proteins ?? []),
          ...(item.vegetables ?? []),
        ]
          .map((i) => i.name)
          .join("-");
        conector.setEmphasize(0).write(`${stringRelleno}\n`);
      }
      // extras
      if (item?.extraProduct) {
        conector.setEmphasize(1).write(" -Extras: ");
        const stringExtras = item.extraProduct.map((i) => i.name).join("-");
        conector.setEmphasize(0).write(`${stringExtras}\n`);
      }
      // Salsas
      conector.setEmphasize(1).write(" -Salsas: ");
      if (item.sauces) {
        const stringRelleno = item.sauces
          .map((i) => (i?.name ? i.name.replace("Salsa de", "") : ""))
          .join("-");
        conector.setEmphasize(0).write(`${stringRelleno}\n`);
      }
    }
    if (item?.note) {
      // notas
      conector.setEmphasize(1);
      conector.setAlign("center");
      conector.write(`*${item?.note}*\n`);
    }
    conector.feed(1);
  });

  // productos extras
  if (order?.orderExtraItems.length > 0) {
    conector.setEmphasize(0);
    conector.setAlign("left");
    conector.write(`Productos extra: \n`);
    order?.orderExtraItems?.map((ei) => {
      conector.write(` ${ei.quantity} ${ei.name}\n`);
    });
  }
  conector.feed(1);

  // total

  conector.setAlign("right");
  conector.setEmphasize(1);
  conector.write("----------------------------\n");
  conector.write(`Total:${currency.format(Math.round(order.total))}`);
  conector.feed(3);
  conector.setAlign("center");
  conector.write("***Gracias por su compra***\n");
  conector.feed(1);
  conector.setEmphasize(0);
  conector.setAlign("right");
  conector.write(`N° ${order._id.slice(-10)}`);
  conector.feed(1);
  conector.cut();
  conector
    .imprimirEnImpresora("ImpresoraTermica")
    .then((respuestaAlImprimir) => {
      if (respuestaAlImprimir === true) {
        console.log("Impreso correctamente");
      } else {
        console.log("Error. La respuesta es: " + respuestaAlImprimir);
      }
    });
};

// })();
