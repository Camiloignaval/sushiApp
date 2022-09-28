import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState, FC } from "react";
import NextLink from "next/link";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../../store/Slices/UISlice";
import { IoMdClose } from "react-icons/io";
import { RootState } from "../../store";
import { currency } from "../../utils";
import { HomeOutlined, MapOutlined } from "@mui/icons-material";
import Image from "next/image";

interface Props {
  showPrice?: boolean;
}

export const Navbar: FC<Props> = ({ showPrice = false }) => {
  const { asPath, push } = useRouter();
  const dispatch = useDispatch();
  const router = useRouter();
  // const pathName = useMemo(() => router.pathname, [router]);
  const [searchTerm, setSearchTerm] = useState("");
  const { scrollIsDown } = useSelector((state: RootState) => state.ui);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { numberOfItems, total } = useSelector(
    (state: RootState) => state.cart
  );

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
    setIsSearchVisible(false);
  };

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
          src="/logos/logo-sushi-panko-pequeno.png"
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
              Sushi Panko |
            </Typography>
            <Typography
              variant="overline"
              mt={0.3}
              sx={{ marginLeft: { xs: 0.2, sm: 0.5 } }}
            >
              Maipú
            </Typography>
          </Link>
        </NextLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }} />
        {/* pantallas pequeños */}
        <IconButton
          sx={{ display: { xs: "", sm: "none" } }}
          onClick={() => dispatch(toggleMenu())}
        >
          <BiSearchAlt />
        </IconButton>
        {/* pantallas grandes */}
        {/* {isSearchVisible ? (
          <Input
            sx={{ display: { xs: "none", sm: "flex" } }}
            autoFocus
            onKeyPress={(e) => (e.key == "Enter" ? onSearchTerm() : null)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setIsSearchVisible(false)}
                  aria-label="toggle password visibility"
                >
                  <IoMdClose />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            sx={{ display: { xs: "none", sm: "flex" } }}
            onClick={() => setIsSearchVisible(true)}
            aria-label="toggle password visibility"
            className="fadeIn"
          >
            <BiSearchAlt />
          </IconButton>
        )} */}
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
              <NextLink href="/cart" passHref>
                <Link>
                  <IconButton>
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
        )}
        {isLoggedIn ? (
          <Button
            sx={{ backgroundColor: "transparent" }}
            onClick={() => dispatch(toggleMenu())}
          >
            Menú
          </Button>
        ) : (
          <IconButton
            onClick={() => router.push("/")}
            aria-label="delete"
            size="large"
          >
            <HomeOutlined fontSize="inherit" />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};
