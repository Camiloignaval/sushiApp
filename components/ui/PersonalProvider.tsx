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
  const { cart } = useSelector((state: RootState) => state.cart);
  const { data, status } = useSession();

  // atento al carrito
  // -----------------
  useEffect(() => {
    try {
      setFirstRender(false);
      const cookiesCart = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch(addOrUpdateCart(cookiesCart));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (firstRender) return;
    Cookie.set("cart", JSON.stringify(cart));
  }, [cart, firstRender]);

  // calculo de precios
  useEffect(() => {
    const numberOfItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const subTotal = cart.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    );
    const tax =
      (subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)) / 100;
    const total = subTotal + tax;
    const ordenSummary = {
      numberOfItems,
      subTotal,
      tax,
      total,
    };
    dispatch(updateSummary(ordenSummary));
  }, [cart, dispatch]);

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
