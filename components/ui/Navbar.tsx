import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import NextLink from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../../store/Slices/UISlice";
import { RootState } from "../../store";
import { currency } from "../../utils";
import { HomeOutlined, MapOutlined } from "@mui/icons-material";
import Image from "next/image";
import { BellNotification } from "./BellNotification";

interface Props {
  showPrice?: boolean;
}

export const Navbar: FC<Props> = ({ showPrice = false }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const pathName = useMemo(() => router.pathname, [router]);
  const { scrollIsDown } = useSelector((state: RootState) => state.ui);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { numberOfItems, total } = useSelector(
    (state: RootState) => state.cart
  );
  const { store } = useSelector((state: RootState) => state.ui);
  return (
    <AppBar
      sx={{
        backgroundColor: !scrollIsDown ? "rgba(255, 255, 255, 0.4)" : undefined,
        backdropFilter: !scrollIsDown ? "blur(9px)" : undefined,
      }}
    >
      <Toolbar>
        <Image
          onDoubleClick={() => router.push("/login")}
          width={40}
          height={40}
          alt="Logo"
          src="https://res.cloudinary.com/dc6vako2z/image/upload/v1665472282/SushiApp/logo-sushi-panko-pequeno_cijlft_szxjwx.webp"
        ></Image>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography
              marginLeft={{ xs: 1, sm: 2 }}
              // variant={}
              sx={{
                fontSize: { xs: ".9rem", sm: "1.2rem" },
                fontWeight: 600,
                transform: { xs: "scale(1, 1.3)", sm: "scale(1, 1)" },
              }}
            >
              Sushi Panko
            </Typography>
            <Typography
              variant="overline"
              mt={0.4}
              sx={{
                marginLeft: { xs: 0.2, sm: 1 },
                transform: { xs: "scale(.8, .9)", sm: "scale(1, 1)" },
              }}
            >
              Maipú
            </Typography>
          </Link>
        </NextLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }} />
        {showPrice && (
          <>
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              <Typography
                sx={{ position: "relative", top: 4 }}
                color={"primary"}
                variant="h6"
              >
                {currency.format(total)}
              </Typography>
              <NextLink href={store.type === "close" ? "/" : "/cart"} passHref>
                <Link>
                  <IconButton disabled={store.type === "close"}>
                    <Badge
                      badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                      color="secondary"
                    >
                      <AiOutlineShoppingCart />
                    </Badge>
                  </IconButton>
                </Link>
              </NextLink>
            </Box>
            <NextLink href="/map" passHref>
              <Link>
                <IconButton>
                  <MapOutlined />
                </IconButton>
              </Link>
            </NextLink>
          </>
        )}{" "}
        <IconButton
          onClick={() => router.push("/")}
          aria-label="delete"
          size="large"
        >
          <HomeOutlined fontSize="inherit" />
        </IconButton>
        {isLoggedIn && (
          <>
            <Button
              sx={{ backgroundColor: "transparent" }}
              onClick={() => dispatch(toggleMenu())}
            >
              Menú
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
