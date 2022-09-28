import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes";
import { SWRConfig } from "swr";
import { Provider } from "react-redux";
import { store } from "../store";
import { Toaster } from "react-hot-toast";
import { PersonalProvider } from "../components/ui/PersonalProvider";

function MyApp({ Component, pageProps }: AppProps) {
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
