import Cookie from "js-cookie";
import { useSession } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../../interfaces";
import { RootState } from "../../store";
import { useCheckTokenQuery } from "../../store/RTKQuery/authApi";
import { LogIn } from "../../store/Slices/AuthSlice";
import {
  addOrUpdateCart,
  addOrUpdateExtraProducts,
  updateAdress,
  updateSummary,
} from "../../store/Slices/CartSlice";

interface Props {
  children: React.ReactNode;
}

// * En este archivo se crearan las funciones necesarias que este atento el store global

export const PersonalProvider: FC<Props> = ({ children }) => {
  const [firstRender, setFirstRender] = useState(true);
  const dispatch = useDispatch();
  const { cart, extraProduct } = useSelector((state: RootState) => state.cart);
  const { data, status } = useSession();

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
    if (firstRender) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, firstRender]);

  useEffect(() => {
    if (firstRender) return;
    localStorage.setItem("extracart", JSON.stringify(extraProduct));
  }, [extraProduct, firstRender]);

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
    // const tax =
    //   (subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)) / 100;
    const total = subTotal;
    const ordenSummary = {
      numberOfItems,
      subTotal,
      total,
    };
    dispatch(updateSummary(ordenSummary));
  }, [cart, extraProduct, dispatch]);

  // -----------------

  // Adress
  useEffect(() => {
    const address = Cookie.get("address");
    if (address) dispatch(updateAdress(JSON.parse(address)));
  }, [dispatch]);

  // auth
  // try {
  //   Cookie.get("token");
  //   useCheckTokenQuery();
  // } catch (error) {
  //   console.log(error);
  // }

  // * effect para nextauth
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(LogIn(data?.user as IUser));
    }
  }, [status, data, dispatch]);

  return <>{children}</>;
};
