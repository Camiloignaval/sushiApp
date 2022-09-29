import { format, isAfter, isBefore } from "date-fns";
import Cookie from "js-cookie";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ISettingsStore, IUser } from "../../interfaces";
import { RootState } from "../../store";
import { useCheckTokenQuery } from "../../store/RTKQuery/authApi";
import { useGetSettingsStoreQuery } from "../../store/RTKQuery/settings";
import { LogIn } from "../../store/Slices/AuthSlice";
import esLocale from "date-fns/locale/es";

import {
  addCoupon,
  addDeliveryPrice,
  addOrUpdateCart,
  addOrUpdateExtraProducts,
  removeCoupon,
  updateAdress,
  updateSummary,
} from "../../store/Slices/CartSlice";
import { currency } from "../../utils";
import { closeStore, openStore } from "../../store/Slices/UISlice";
import { analizeIfStoreIsOpen } from "../../utils/analizeIfStoreIsOpen";

interface Props {
  children: React.ReactNode;
}

// * En este archivo se crearan las funciones necesarias que este atento el store global

export const PersonalProvider: FC<Props> = ({ children }) => {
  const { data: settingsData } = useGetSettingsStoreQuery();
  const [firstRender, setFirstRender] = useState(true);
  const { data } = useCheckTokenQuery();
  const dispatch = useDispatch();
  const {
    cart,
    extraProduct,
    coupon,
    subTotal,
    deliverPrice,
    valuedAddress,
    valuedPlaceId,
    shippingAddress,
  } = useSelector((state: RootState) => state.cart);
  const { storeIsOpen } = useSelector((state: RootState) => state.ui);

  // analizar si esta abierta la tienda o no
  useEffect(() => {
    if (settingsData) {
      // const today = format(new Date(), "EEEE", { locale: esLocale });
      // const hourNow = format(new Date(), "HH:mm");
      // const horaApertura = format(
      //   new Date((settingsData as any)[today].scheduleOpen),
      //   "HH:mm"
      // );
      // const horaCierre = format(
      //   new Date((settingsData as any)[today].scheduleClose),
      //   "HH:mm"
      // );

      // const isAfterOfOpen = isAfter(
      //   new Date(`2022-06-06 ${hourNow}`),
      //   new Date(`2022-06-06 ${horaApertura}`)
      // );
      // const isBeforeOfOpen = isBefore(
      //   new Date(`2022-06-06 ${hourNow}`),
      //   new Date(`2022-06-06 ${horaCierre}`)
      // );

      // // if (settingsData.forceOpen) {
      // //   dispatch(openStore());
      // //   return;
      // // }
      // // if (settingsData.forceClose) {
      // //   dispatch(closeStore());
      // //   return;
      // // }

      // // if (isAfterOfOpen && isBeforeOfOpen) {
      // //   dispatch(openStore());
      // //   return;
      // // }
      analizeIfStoreIsOpen(settingsData)
        ? dispatch(openStore())
        : dispatch(closeStore());

      Cookie.set("settings", JSON.stringify(settingsData));
      dispatch(closeStore());
    }
  }, [settingsData, storeIsOpen]);

  // atento al carrito
  // -----------------
  useEffect(() => {
    try {
      setFirstRender(false);

      const extraSaved = localStorage.getItem("extracart")
        ? JSON.parse(localStorage.getItem("extracart")!)
        : [];
      dispatch(addOrUpdateExtraProducts(extraSaved));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  useEffect(() => {
    try {
      setFirstRender(false);
      const cartSaved = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart")!)
        : [];
      dispatch(addOrUpdateCart(cartSaved));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      setFirstRender(false);
      const couponSaved = localStorage.getItem("coupon")
        ? JSON.parse(localStorage.getItem("coupon")!)
        : undefined;
      couponSaved !== undefined && addCoupon(couponSaved);
      // dispatch(addCoupon(couponSaved));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  useEffect(() => {
    try {
      setFirstRender(false);
      const deliverPriceSaved = localStorage.getItem("deliverPrice")
        ? JSON.parse(localStorage.getItem("deliverPrice")!)
        : [];
      dispatch(
        addDeliveryPrice({
          deliveryPrice: +deliverPriceSaved.deliverPrice,
          valuedAddress: deliverPriceSaved.valuedAddress,
          valuedPlaceId: deliverPriceSaved.valuedPlaceId,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (firstRender) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, firstRender]);
  useEffect(() => {
    if (firstRender) return;
    localStorage.setItem("coupon", JSON.stringify(coupon));
  }, [coupon, firstRender]);

  useEffect(() => {
    if (firstRender) return;
    localStorage.setItem("extracart", JSON.stringify(extraProduct));
  }, [extraProduct, firstRender]);
  useEffect(() => {
    if (firstRender) return;
    localStorage.setItem(
      "deliverPrice",
      JSON.stringify({ deliverPrice, valuedAddress, valuedPlaceId })
    );
  }, [deliverPrice, firstRender, valuedAddress, valuedPlaceId]);

  // useEffect(() => {
  //   if (coupon && coupon.) {
  //     console.log({ coupon });
  //   }
  // }, [coupon]);

  // atento si baja el precio del cupon con compra minima
  useEffect(() => {
    if (coupon && coupon?.minPurchase) {
      if (subTotal < coupon?.minPurchase) {
        toast(
          `Cupón ha sido removido, ya que su compra es inferior a ${currency.format(
            coupon.minPurchase
          )}`
        );
        dispatch(removeCoupon());
      }
    }
  }, [subTotal, dispatch, coupon]);

  // calculo de precios
  useEffect(() => {
    const numberOfItems = cart.reduce((acc, curr) => +acc + +curr.quantity, 0);
    const priceOfExtras = extraProduct.reduce(
      (acc, curr) => +acc + +curr.price * +curr.quantity,
      0
    );
    const subTotal =
      cart.reduce((acc, curr) => acc + +curr.price * +curr.quantity, 0) +
      priceOfExtras;

    let discount = 0;
    // cupon
    if (coupon) {
      if (coupon.type === "money") {
        discount = coupon.discount;
      }
      if (coupon.type === "percentage") {
        discount = subTotal * (coupon.discount / 100);
        if (coupon.maxDiscount) {
          if (discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        }
      }
    }

    const total = subTotal - discount + (deliverPrice ? deliverPrice : 0);
    const ordenSummary = {
      numberOfItems,
      subTotal,
      total,
      discount,
    };
    dispatch(updateSummary(ordenSummary));
  }, [cart, extraProduct, deliverPrice, dispatch, coupon]);

  // -----------------

  // Adress
  useEffect(() => {
    const address = Cookie.get("address");
    if (address) dispatch(updateAdress(JSON.parse(address)));
  }, [dispatch]);

  // auth
  try {
    Cookie.get("token");
  } catch (error) {
    console.log(error);
  }

  return <>{children}</>;
};
