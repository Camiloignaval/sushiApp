import { Box, Typography, IconButton, Badge } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { currency } from "../../utils";
import { Navbar, SideMenu } from "../ui";
import "@animxyz/core";

interface Props {
  children: React.ReactNode;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

const storeIsCloseImg =
  "https://res.cloudinary.com/dc6vako2z/image/upload/v1664867224/SushiApp/cerrados_ztitt7.webp";
const openSoonImg =
  "https://res.cloudinary.com/dc6vako2z/image/upload/v1664865542/SushiApp/abrimos-pronto_lnnqr4.webp";
export const MainShopLayout: FC<Props> = ({
  children,
  pageDescription,
  imageFullUrl,
  title,
}) => {
  const { store } = useSelector((state: RootState) => state.ui);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="author" content="Camilo Valenzuela" />
        <meta
          name="keywords"
          content="sushi, maipú, maipu, panko, rolls, roll, tempura, comida rapida, delivery, sushipanko"
        />
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
      <Box
        sx={{
          position: "relative",
          width: "calc(100vw - 1px)",
          height: { xs: "calc(100vh - 100px)", sm: "calc(100vh - 50px)" },
        }}
      >
        <Image
          priority
          width={"100%"}
          height={"100%"}
          layout="fill"
          objectFit="cover"
          // quality={100}
          alt="Imagen portada"
          src="https://res.cloudinary.com/dc6vako2z/image/upload/v1664357156/SushiApp/sushi-portada_rqe7im.webp"
          // loading="eager"
        />
      </Box>
      {/* CARTEL CERRADO */}
      {!store.isOpen && (
        <Box
          className="item-group"
          sx={{
            position: "absolute",
            top: 25,
            left: -40,
            width: { xs: 300, sm: 500 },
            height: { xs: 300, sm: 500 },
            zIndex: 900,
            textShadow: "0px 5px 6px #FFFFFF;",
            filter: "drop-shadow(5px 6px 10px rgba(0, 0, 0, 0.40))",
          }}
        >
          <Image
            // className="square xyz-in"
            className="swingimage"
            priority
            // width={"20vw"}
            // height={"500px"}
            layout="fill"
            // objectFit="cover"
            // quality={100}
            alt="Imagen cerrado"
            src={store.type === "soon" ? openSoonImg : storeIsCloseImg}
            // loading="eager"
          />
        </Box>
      )}

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
