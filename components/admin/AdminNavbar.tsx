import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { useDispatch } from "react-redux";
import { toggleMenu } from "../../store/Slices/UISlice";

export const AdminNavbar = () => {
  const dispatch = useDispatch();
  // const pathName = useMemo(() => router.pathname, [router]);

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
        <Button onClick={() => dispatch(toggleMenu())}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
