import { Box } from "@mui/material";
import Head from "next/head";
import { FC } from "react";

interface Props {
  children: JSX.Element;
  title: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <Box
          display="flex"
          justifyContent="center"
          height="calc(100vh - 200px)"
          alignItems="center"
        >
          {children}
        </Box>
      </main>
    </>
  );
};
