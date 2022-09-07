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

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const dispatch = useDispatch();
  // const pathName = useMemo(() => router.pathname, [router]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { numberOfItems } = useSelector((state: RootState) => state.cart);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
    setIsSearchVisible(false);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Shop |</Typography>
            <Typography sx={{ marginLeft: 0.5 }}>App</Typography>
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
        <Button onClick={() => dispatch(toggleMenu())}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
