import { Box, Typography, IconButton, Badge } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { currency } from "../../utils";
import { Navbar, SideMenu } from "../ui";

interface Props {
  children: React.ReactNode;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const MainShopLayout: FC<Props> = ({
  children,
  pageDescription,
  imageFullUrl,
  title,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {/* <script src="sweetalert2.all.min.js" /> */}

        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <Navbar showPrice />
      </nav>
      <SideMenu />

      <img
        style={{
          width: "calc(100vw - 1px)",
          height: "calc(100vh - 50px)",
          position: "relative",
          objectFit: "cover",
        }}
        src="/images/sushi-portada.jpg"
        alt="Imagen portada"
        // loading="eager"
      />

      <main
        style={{
          margin: "-6px auto 80px auto",
          maxWidth: "1440px",
          padding: "0 30px",
        }}
      >
        {children}
      </main>
      {/* footer */}
      <footer>{/* customfooter */}</footer>
    </>
  );
};
