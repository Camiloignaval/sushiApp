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
import React, { useState } from "react";
import NextLink from "next/link";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../../store/Slices/UISlice";
import { IoMdClose } from "react-icons/io";
import { RootState } from "../../store";
import { currency } from "../../utils";

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const dispatch = useDispatch();
  // const pathName = useMemo(() => router.pathname, [router]);
  const [searchTerm, setSearchTerm] = useState("");
  const { scrollIsDown } = useSelector((state: RootState) => state.ui);
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
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <img width={40} alt="Logo" src="/logos/logo-sushi-panko.png"></img>
            <Typography marginLeft={2} variant="h6">
              SUSHI Panko |
            </Typography>
            <Typography sx={{ marginLeft: 0.5 }}>Maipú</Typography>
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
        {isSearchVisible ? (
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
        )}
        {!asPath.startsWith("/cart") && (
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
          </>
        )}
        <Button
          sx={{ backgroundColor: "transparent" }}
          onClick={() => dispatch(toggleMenu())}
        >
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  );
};
