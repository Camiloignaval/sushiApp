import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ShopLayout } from "../layouts";
import { IShippingAdress } from "../../interfaces";
import { updateAdress } from "../../store/Slices/CartSlice";
import HomeIconOutlined from "@mui/icons-material/HomeOutlined";
import { countries } from "../../utils";
import {
  AccountCircle,
  LocationCityOutlined,
  PersonAddAlt1Outlined,
  PersonOutline,
  PhoneAndroidOutlined,
} from "@mui/icons-material";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js";
import { RootState } from "../../store";

const emptyAddress: IShippingAdress = {
  username: "",
  address: "",
  city: "",
  commune: "",
  phone: "",
};

const getAdressFromCookies = (): IShippingAdress => {
  return Cookies.get("address")
    ? JSON.parse(Cookies.get("address")!)
    : emptyAddress;
};

export const AddressForm = () => {
  const { shippingAddress } = useSelector((state: RootState) => state.cart);
  const [isModificable, setIsModificable] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IShippingAdress>({
    defaultValues: getAdressFromCookies(),
  });

  // ver si hay direccion en carrito al cargar pagina

  useEffect(() => {
    setIsModificable(!shippingAddress);
  }, [shippingAddress]);

  const onSubmitAddress = (data: IShippingAdress) => {
    if (!isModificable) {
      setIsModificable(true);
      return;
    }
    data.city = "Santiago";
    data.commune = "Maipú";
    Cookies.set("address", JSON.stringify(data));
    setIsModificable(false);
    dispatch(updateAdress(data));
  };
  return (
    <Box marginBottom={5}>
      <Typography variant="h2" component="h2">
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} lg={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidOutlined />
                  </InputAdornment>
                ),
              }}
              disabled={!isModificable}
              label="Telefono"
              variant="standard"
              fullWidth
              {...register("phone", {
                required: "Este campo es requerido",
                // pattern: {
                //   value: /\A(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}\z/,
                //   message: "Numero de telefono invalido",
                // },

                validate: (value) => {
                  return (
                    isValidPhoneNumber(value) ||
                    "Ingresar en formato +569xxxxxxxx"
                  );
                },
              })}
              error={!!errors.phone}
              helperText={errors?.phone?.message}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
                  </InputAdornment>
                ),
              }}
              disabled={!isModificable}
              label="Nombre"
              variant="standard"
              fullWidth
              {...register("username", {
                required: "Este campo es requerido",
                minLength: {
                  value: 3,
                  message: "Nombre es demasiado corto",
                },
              })}
              error={!!errors.username}
              helperText={errors?.username?.message}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIconOutlined />
                  </InputAdornment>
                ),
              }}
              disabled={!isModificable}
              label="Direccion"
              variant="standard"
              fullWidth
              {...register("address", {
                required: "Este campo es requerido",
              })}
              error={!!errors.address}
              helperText={errors?.address?.message}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCityOutlined />
                  </InputAdornment>
                ),
              }}
              disabled
              defaultValue="Maipú"
              value="Maipú"
              label="Comuna"
              variant="standard"
              fullWidth
              {...register("commune", {
                // required: "Este campo es requerido",
              })}
              error={!!errors.commune}
              helperText={errors?.commune?.message}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
          {isModificable ? (
            <Button
              fullWidth
              type="submit"
              color="secondary"
              className="circular-btn"
              size="small"
            >
              Agregar dirección
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              color="secondary"
              className="circular-btn"
              size="small"
            >
              Modificar dirección
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = "" } = req.cookies as { token: string };
//   let isValidToken = false;

//   try {
//     await jwt.isValidToken(token);
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: "/auth/login?p=/checkout/adress",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
