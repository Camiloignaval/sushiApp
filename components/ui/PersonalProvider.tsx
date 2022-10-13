import Cookie from "js-cookie";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useCheckTokenMutation } from "../../store/RTKQuery/authApi";
import { useGetSettingsStoreQuery } from "../../store/RTKQuery/settings";

import {
  addCoupon,
  addDeliveryPrice,
  addOrUpdateCart,
  addOrUpdateExtraProducts,
  removeCoupon,
  reserveHour,
  updateAdress,
  updateSummary,
} from "../../store/Slices/CartSlice";
import { currency } from "../../utils";
import {
  changeNewNotifications,
  changeordersViews,
  changeTotalOrders,
  storeState,
} from "../../store/Slices/UISlice";
import { analizeIfStoreIsOpen } from "../../utils/analizeIfStoreIsOpen";
import { useCountOrdersNumberQuery } from "../../store/RTKQuery/ordersApi";

interface Props {
  children: React.ReactNode;
}

// * En este archivo se crearan las funciones necesarias que este atento el store global

export const PersonalProvider: FC<Props> = ({ children }) => {
  const { data: settingsData } = useGetSettingsStoreQuery();
  const [firstRender, setFirstRender] = useState(true);
  const [checkToken] = useCheckTokenMutation();
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
    reservedHour,
  } = useSelector((state: RootState) => state.cart);
  // const { store, ordersviews, actualOrders, newNotifications } = useSelector(
  //   (state: RootState) => state.ui
  // );
  // const { data: numberOfOrders } = useCountOrdersNumberQuery(null);

  // NOTIFICACIONES
  // setear ordenes al inicio
  // useEffect(() => {
  //   if (numberOfOrders) {
  //     if (ordersviews === null) {
  //       console.log({ ordersviews });
  //       console.log("entre a changeordersViews");
  //       dispatch(changeordersViews(numberOfOrders));
  //     }
  //     dispatch(changeTotalOrders(numberOfOrders));
  //   }
  // }, [numberOfOrders, firstRender]);
  // useEffect(() => {
  //   dispatch(changeNewNotifications(+actualOrders - +ordersviews! ?? 0));
  // }, [actualOrders, ordersviews]);

  // analizar si esta abierta la tienda o no
  useEffect(() => {
    if (settingsData) {
      const status = analizeIfStoreIsOpen(settingsData);
      dispatch(storeState(status as any));

      Cookie.set("settings", JSON.stringify(settingsData));
    }
  }, [settingsData]);

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

  // atento a resrva de hroa
  useEffect(() => {
    if (firstRender) return;
    reservedHour &&
      localStorage.setItem("reserverHour", JSON.stringify(reservedHour));
  }, [reservedHour, firstRender]);

  useEffect(() => {
    try {
      setFirstRender(false);

      const reserverHour = localStorage?.getItem("reserverHour")
        ? JSON.parse(localStorage?.getItem("reserverHour")!)
        : undefined;
      reserverHour && dispatch(reserveHour(reserverHour));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
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
        discount = Math.ceil((subTotal * (coupon.discount / 100)) / 100) * 100;
        console.log({ discount });
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

  useEffect(() => {
    if (firstRender) {
      try {
        const token = Cookie.get("token");
        console.log({ token });
        if (token) {
          checkToken();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [firstRender]);

  return <>{children}</>;
};
