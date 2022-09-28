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
  DeliveryDiningOutlined,
  FilterFramesOutlined,
  Inventory2Outlined,
  LocalOfferOutlined,
  LocationCityOutlined,
  LoginOutlined,
  SettingsOutlined,
  VpnKeyOutlined,
  WhatsappOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { toggleMenu } from "../../store/Slices/UISlice";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import Cookies from "js-cookie";

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
                <Inventory2Outlined />
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
                <ConfirmationNumberOutlined />
              </ListItemIcon>
              <ListItemText primary={"Cupones"} />
            </ListItem>

            <ListItem button onClick={() => navigateTo(`/admin/orders`)}>
              <ListItemIcon>
                <FilterFramesOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ordenes"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/deliver`)}>
              <ListItemIcon>
                <DeliveryDiningOutlined />
              </ListItemIcon>
              <ListItemText primary={"En ruta"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/users`)}>
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary={"Clientes"} />
            </ListItem>
            <ListItem button onClick={() => navigateTo(`/admin/settings`)}>
              <ListItemIcon>
                <SettingsOutlined />
              </ListItemIcon>
              <ListItemText primary={"Configuración"} />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                window.open("https://whatsapp-api-cv.herokuapp.com/", "_blank")
              }
            >
              <ListItemIcon>
                <WhatsappOutlined />
              </ListItemIcon>
              <ListItemText primary={"Whatsapp"} />
            </ListItem>
          </>
          {/* )} */}
        </List>
      </Box>
    </Drawer>
  );
};
