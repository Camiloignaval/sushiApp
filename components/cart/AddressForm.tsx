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
import { IShippingAdress } from "../../interfaces";
import {
  addDeliveryPrice,
  cleanDeliverPrice,
  updateAdress,
} from "../../store/Slices/CartSlice";
import { PersonOutline, PhoneAndroidOutlined } from "@mui/icons-material";
import { isValidPhoneNumber } from "libphonenumber-js";
import { RootState } from "../../store";
import { AutoCompletePlace } from "../google/AutoCompletePlace";
import axios from "axios";

const emptyAddress: IShippingAdress = {
  username: "",
  address: "",
  phone: "",
};

const getAdressFromCookies = (): IShippingAdress => {
  return Cookies.get("address")
    ? JSON.parse(Cookies.get("address")!)
    : emptyAddress;
};
const placeIdDesire =
  "EhpEZXNpcmUgMjkwMCwgTWFpcMO6LCBDaGlsZSIxEi8KFAoSCbFHAS_OwmKWEYjH62N6qeJCENQWKhQKEgnrvQ3hz8JilhHPZ_2m_Zd-IQ";

interface Props {
  isModificable: boolean;
  setIsModificable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddressForm: FC<Props> = ({ isModificable, setIsModificable }) => {
  const [addressFound, setAddressFound] = useState(null);
  const { cart, shippingAddress, deliverPrice, valuedAddress, valuedPlaceId } =
    useSelector((state: RootState) => state.cart);
  const [placeIdState, setPlaceIdState] = useState<null | string>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IShippingAdress>({
    defaultValues: getAdressFromCookies(),
  });

  // verificar que valor cotizado corresponda que la direccion guardada
  useEffect(() => {
    if (shippingAddress) {
      if (shippingAddress.address !== valuedAddress) {
        // realizar calculo denuevo
        searchPriceDeliverIfWasSaved(
          shippingAddress.placeId!,
          shippingAddress.address
        );
      }
    } else {
      dispatch(cleanDeliverPrice());
    }
  }, []);

  // ver si hay direccion en carrito al cargar pagina
  useEffect(() => {
    setIsModificable(!shippingAddress);
  }, [shippingAddress]);

  const onSubmitAddress = (data: IShippingAdress) => {
    if (!isModificable) {
      setIsModificable(true);
      return;
    }
    data.placeId = placeIdState!;
    Cookies.set("address", JSON.stringify(data));
    setIsModificable(false);

    dispatch(updateAdress(data));
  };

  const findClient = async () => {
    const phone = `+56${getValues("phone").trim()}`;
    try {
      const { data } = await axios.post(`/api/user/findUser`, { phone });
      setAddressFound(data.address);
      setValue("username", data.name);
      setValue("phone", data.phone.replace("+56", ""));
      setValue("address", data.address);
      setPlaceIdState(data.placeId);
      searchPriceDeliverIfWasSaved(data.placeId, data.address);
    } catch (error) {
      console.log({ error });
    }
  };

  const searchPriceDeliverIfWasSaved = async (
    placeId: string,
    addressDir: string
  ) => {
    const respMatrix = await axios(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:${placeId}&origins=place_id:${placeIdDesire}&units=imperial&key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw`
    );

    // calcular tarifa de delivery
    let deliveryPrice = 1000;
    const {
      data: { rows },
    } = respMatrix;
    const { distance, duration } = rows[0].elements[0];
    if (distance.value > 2000) {
      deliveryPrice += (Math.round(distance.value - 2000) / 1000) * 500;
    }
    dispatch(
      addDeliveryPrice({
        deliveryPrice: Math.round(+deliveryPrice / 100) * 100,
        valuedAddress: addressDir,
        selectedDirection: placeId,
      })
    );
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
                    +56
                  </InputAdornment>
                ),
              }}
              autoComplete="off"
              disabled={!isModificable}
              label="Telefono"
              variant="standard"
              fullWidth
              {...register("phone", {
                onBlur: findClient,
                required: "Este campo es requerido",
                // pattern: {
                //   value: /\A(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}\z/,
                //   message: "Numero de telefono invalido",
                // },

                validate: (value) => {
                  return (
                    isValidPhoneNumber(`+56${value}`) ||
                    "Ingresar en formato 9xxxxxxxx (Sin +56)"
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
              autoComplete="off"
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
          <Grid item xs={12} lg={12}>
            <AutoCompletePlace
              addressFound={addressFound}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              disableInput={!isModificable}
              placeIdState={placeIdState}
              setPlaceIdState={setPlaceIdState}
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
              Guardar dirección
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
