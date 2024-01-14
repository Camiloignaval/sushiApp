import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes";
import { SWRConfig } from "swr";
import { Provider } from "react-redux";
import { store } from "../store";
import { Toaster } from "react-hot-toast";
import { PersonalProvider } from "../components/ui/PersonalProvider";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      // delay: 200,
      duration: 2000,
    });
  }, []);
  setTimeout(() => {
    AOS.refresh();
  }, 2000);

  return (
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
          <Toaster />
        </ThemeProvider>
      </SWRConfig>
    </Provider>
  );
}

export default MyApp;
