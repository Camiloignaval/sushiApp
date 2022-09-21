import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
  LocalOfferOutlined,
  LocationCityOutlined,
  LoginOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { toggleMenu } from "../../store/Slices/UISlice";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

export const SideMenu = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    ui: { sideBarIsOpen },
    auth: { isLoggedIn, user },
  } = useSelector((state: RootState) => state);
  const [searchTerm, setSearchTerm] = useState("");

  const navigateTo = (url: string) => {
    router.push(url);
    dispatch(toggleMenu());
  };

  const onSearchTerm = () => {
    if (searchTerm.length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  };

  const onLogout = () => {
    // Cookies.remove("token");
    Cookies.remove("cart");
    Cookies.remove("address");
    // router.reload();
    signOut();
  };

  return (
    <Drawer
      role="presentation"
      open={sideBarIsOpen}
      anchor="right"
      onClose={() => dispatch(toggleMenu())}
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          {/* <ListItem>
            <Input
              autoFocus
              onKeyPress={(e) => (e.key == "Enter" ? onSearchTerm() : null)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={onSearchTerm}
                    aria-label="toggle password visibility"
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem> */}

          {!isLoggedIn ? (
            <ListItem
              button
              onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
            >
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ingresar"} />
            </ListItem>
          ) : (
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={"Salir"} />
            </ListItem>
          )}
          <ListItem button onClick={onLogout}>
            <ListItemIcon>
              <LocationCityOutlined />
            </ListItemIcon>
            <ListItemText primary={"Consulta tu dirección"} />
          </ListItem>

          {/* Admin */}
          {/* {isLoggedIn && user?.role === "admin" && ( */}
          <>
            <Divider />
            <ListSubheader>Admin Panel</ListSubheader>
            <ListItem button onClick={() => navigateTo(`/admin`)}>
              <ListItemIcon>
                <DashboardOutlined />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/promotions`)}>
              <ListItemIcon>
                <LocalOfferOutlined />
              </ListItemIcon>
              <ListItemText primary={"Promociones"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/products`)}>
              <ListItemIcon>
                <CategoryOutlined />
              </ListItemIcon>
              <ListItemText primary={"Productos"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/categories`)}>
              <ListItemIcon>
                <CategoryOutlined />
              </ListItemIcon>
              <ListItemText primary={"Categorias"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/coupons`)}>
              <ListItemIcon>
                <CategoryOutlined />
              </ListItemIcon>
              <ListItemText primary={"Cupones"} />
            </ListItem>

            <ListItem button onClick={() => navigateTo(`/admin/orders`)}>
              <ListItemIcon>
                <ConfirmationNumberOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ordenes"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/users`)}>
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary={"Clientes"} />
            </ListItem>
          </>
          {/* )} */}
        </List>
      </Box>
    </Drawer>
  );
};
