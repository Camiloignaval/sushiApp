import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ShopLayout } from "../../components/layouts";
import { IShippingAdress } from "../../interfaces";
import { updateAdress } from "../../store/Slices/CartSlice";
import { countries } from "../../utils";

const emptyAddress: IShippingAdress = {
  firstName: "",
  lastName: "",
  adress: "",
  adress2: "",
  zip: "",
  city: "",
  country: "CHL",
  phone: "",
};

const getAdressFromCookies = (): IShippingAdress => {
  return Cookies.get("address")
    ? JSON.parse(Cookies.get("address")!)
    : emptyAddress;
};

const AdressPage = () => {
  console.log("llegue1");
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IShippingAdress>({
    defaultValues: getAdressFromCookies(),
  });

  const onLoginUser = (data: IShippingAdress) => {
    Cookies.set("address", JSON.stringify(data));
    dispatch(updateAdress(data));
    router.push("/checkout/summary");
  };
  return (
    <ShopLayout title="Adress" pageDescription="Confirmar dirección de destino">
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="standard"
              fullWidth
              {...register("firstName", {
                required: "Este campo es requerido",
              })}
              error={!!errors.firstName}
              helperText={errors?.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="standard"
              fullWidth
              {...register("lastName", {
                required: "Este campo es requerido",
              })}
              error={!!errors.lastName}
              helperText={errors?.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion"
              variant="standard"
              fullWidth
              {...register("adress", {
                required: "Este campo es requerido",
              })}
              error={!!errors.adress}
              helperText={errors?.adress?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion 2 (Opcional)"
              variant="standard"
              fullWidth
              {...register("adress2")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Codigo Postal"
              variant="standard"
              fullWidth
              {...register("zip", {
                required: "Este campo es requerido",
              })}
              error={!!errors.zip}
              helperText={errors?.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Pais</InputLabel> */}
              <TextField
                select
                variant="standard"
                id="demo-simple-select"
                label="Pais"
                defaultValue={"CHL"}
                // onChange={handleChange}
                {...register("country", {
                  required: "Este campo es requerido",
                })}
                error={!!errors.country}
                // helperText={errors?.lastName?.message}
              >
                {countries.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="standard"
              fullWidth
              {...register("city", {
                required: "Este campo es requerido",
              })}
              error={!!errors.city}
              helperText={errors?.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefono"
              variant="standard"
              fullWidth
              {...register("phone", {
                required: "Este campo es requerido",
              })}
              error={!!errors.phone}
              helperText={errors?.phone?.message}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
          <Button
            type="submit"
            color="secondary"
            className="circular-btn"
            size="large"
          >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
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

export default AdressPage;
