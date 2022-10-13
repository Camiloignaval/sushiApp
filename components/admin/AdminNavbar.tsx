import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { useDispatch } from "react-redux";
import { toggleMenu } from "../../store/Slices/UISlice";
import { BellNotification } from "../ui";
import { useRouter } from "next/router";
import Image from "next/image";

export const AdminNavbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <Image
          onDoubleClick={() => router.push("/login")}
          width={40}
          height={40}
          alt="Logo"
          src="https://res.cloudinary.com/dc6vako2z/image/upload/v1665472282/SushiApp/logo-sushi-panko-pequeno_cijlft_szxjwx.webp"
        ></Image>
        <Box ml={1}>
          <NextLink href="/" passHref>
            <Link display="flex" alignItems="center">
              <Typography mr={4} variant="h6">
                Sushi Panko
              </Typography>
            </Link>
          </NextLink>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <BellNotification />
        <Button onClick={() => dispatch(toggleMenu())}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
