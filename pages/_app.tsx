import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes";
import { SWRConfig } from "swr";
import { Provider } from "react-redux";
import { store } from "../store";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import { PersonalProvider } from "../components/ui/PersonalProvider";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider
        options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT || "" }}
      >
        <Provider store={store}>
          <SWRConfig
            value={{
              fetcher: (resource, init) =>
                fetch(resource, init).then((res) => res.json()),
            }}
          >
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <PersonalProvider>
                <Component {...pageProps} />
              </PersonalProvider>
              <Toaster
                toastOptions={{
                  success: {
                    style: {
                      background: "green",
                      color: "white",
                    },
                  },
                  error: {
                    style: {
                      background: "white",
                      color: "black",
                      fontWeight: "500",
                    },
                  },
                }}
              />
            </ThemeProvider>
          </SWRConfig>
        </Provider>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

export default MyApp;
