import { isAfter } from "date-fns";
import { currency } from ".";
import { ICoupon } from "./../interfaces/cupon";
export const validateCoupon = (cupon: ICoupon, subTotal: number) => {
  // si tiene fecha de expiracion

  if (cupon.expire) {
    const fechaExp = new Date(cupon.expireIn!);
    const isCaducated = isAfter(new Date(), fechaExp);
    if (isCaducated) {
      throw new Error("Cupón ha expirado");
    }
  }
  //   validar que no se haya alcanzado el limite de cupones usados
  if (cupon.qtyUsed! >= cupon.qtyAvailable) {
    throw new Error("Cupón ha superado el limite");
  }

  //   si hay monto minimo
  if (cupon.minPurchase) {
    if (subTotal < cupon.minPurchase) {
      throw new Error(
        `Monto minimo para utilizar cupon es ${currency.format(
          cupon.minPurchase
        )}`
      );
    }
  }
  return true;
};
