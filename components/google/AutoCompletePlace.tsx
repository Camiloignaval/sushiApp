import * as React from "react";
import Box from "@mui/material/Box";
import { TextField, Button, IconButton } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { SearchOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addDeliveryPrice } from "../../store/Slices/CartSlice";
import {
  FieldErrorsImpl,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { IShippingAdress } from "../../interfaces";
import { IPlaceResponse } from "../../interfaces/placeResponse";
import { RootState } from "../../store";
import { errors } from "jose";
import { GoogleMap, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.API_KEY_GOOGLE;

const autocompleteService = { current: null };

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}
const placeIdDesire =
  "EhpEZXNpcmUgMjkwMCwgTWFpcMO6LCBDaGlsZSIxEi8KFAoSCbFHAS_OwmKWEYjH62N6qeJCENQWKhQKEgnrvQ3hz8JilhHPZ_2m_Zd-IQ";

const deliveryCoords = [
  { lat: -33.49452073393333, lng: -70.73177757034262 },
  { lat: -33.4969364416283, lng: -70.73411645652193 },
  { lat: -33.513388801381225, lng: -70.74189611566437 },
  { lat: -33.52415352788414, lng: -70.75098038740417 },
  { lat: -33.545381215622406, lng: -70.75705358027155 },
  { lat: -33.570388312582615, lng: -70.777518708152 },
  { lat: -33.552611902801914, lng: -70.80242390084511 },
  { lat: -33.5341937254556, lng: -70.80063766785712 },
  { lat: -33.526918952939575, lng: -70.79951489368759 },
  { lat: -33.51806928218032, lng: -70.83309607605747 },
  { lat: -33.49555810717046, lng: -70.82646149592979 },
  { lat: -33.49655870677757, lng: -70.80092017326949 },
  { lat: -33.474254788544485, lng: -70.75820368376311 },
  { lat: -33.47536160690769, lng: -70.73906547216492 },
  { lat: -33.47795831756953, lng: -70.7417193041732 },
  { lat: -33.48545003022266, lng: -70.73360470173378 },
  { lat: -33.49281341166146, lng: -70.73605439281835 },
];

interface Props {
  disableInput: boolean;
  setValue: UseFormSetValue<IShippingAdress>;
  getValues: UseFormSetValue<IShippingAdress>;
  register: UseFormRegister<IShippingAdress>;
  errors: FieldErrorsImpl<{
    phone: string;
    username: string;
    address: string;
  }>;
  addressFound: string | null;
  placeIdState: string | null;
  setPlaceIdState: Dispatch<SetStateAction<string | null>>;
  setIsPossibleSave: Dispatch<SetStateAction<boolean>>;
  coords: {};
  setCoords: Dispatch<SetStateAction<{}>>;
}

export const AutoCompletePlace: React.FC<Props> = ({
  disableInput,
  setValue,
  getValues,
  register,
  errors,
  addressFound,
  placeIdState,
  setPlaceIdState,
  setIsPossibleSave,
  coords,
  setCoords,
}) => {
  const [selectedDirection, setSelectedDirection] =
    React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly PlaceType[]>(
    /* <readonly PlaceType[]> */ []
  );
  const [isError, setIsError] = useState(false);
  const { shippingAddress } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const deliverPolygon =
    typeof window?.google?.maps !== "undefined"
      ? new window.google.maps.Polygon({
          paths: deliveryCoords,
        })
      : null;
  const fetch = React.useMemo(
    () =>
      throttle(
        (request: { input: string }, callback: (results?: any) => void) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        200
      ),
    []
  );

  // si encuentra una direcicon al ingresar telefono
  useEffect(() => {
    if (addressFound) {
      setInputValue(addressFound);
    }
  }, [addressFound]);

  useEffect(() => {
    if (shippingAddress?.address) {
      setInputValue(shippingAddress?.address);
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (selectedDirection) {
      // setValue(null);
      setOptions([]);
    }
  }, [inputValue]);

  const searchLatLngByPlaceId = async () => {
    if (typeof window?.google?.maps !== "undefined") {
      try {
        // const { data } = await axios(
        //   `https://maps.googleapis.com/maps/api/place/details/json?placeid=${selectedDirection!
        //     .place_id!}&key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw`
        // );
        const { data } = await axios.post("/api/google/detailsPlace", {
          place_id: selectedDirection!.place_id,
        });
        const latlng = data?.result?.geometry?.location;
        setCoords(latlng);
        localStorage.setItem("coords", JSON.stringify(latlng));

        setIsPossibleSave(true);

        // // ------------

        if (latlng) {
          const isInPolygon =
            window?.google?.maps.geometry.poly.containsLocation(
              latlng,
              deliverPolygon!
            );
          if (isInPolygon) {
            // si esta en zona de reparto
            const { data: dataDistance } = await axios.post(
              "/api/google/distancePlaces",
              {
                origen: placeIdDesire,
                destino: selectedDirection?.place_id,
              }
            );
            // calcular tarifa de delivery
            let deliveryPrice = 1000;
            const { rows } = dataDistance;
            const { distance, duration } = rows[0].elements[0];
            console.log({ rows });
            if (distance.value > 2000) {
              deliveryPrice += (Math.round(distance.value - 2000) / 1000) * 500;
            }
            dispatch(
              addDeliveryPrice({
                deliveryPrice: Math.round(+deliveryPrice / 100) * 100,
                valuedAddress: selectedDirection?.description,
                valuedPlaceId: selectedDirection?.place_id,
              })
            );
            setValue("address", selectedDirection?.description!);
            setPlaceIdState(selectedDirection?.place_id!);
          } else {
            toast.error("Lo sentimos, aún no llegamos a tu dirección", {
              duration: 4000,
            });
            setCoords({});
            localStorage.removeItem("coords");
            setIsPossibleSave(false);
          }
        }
      } catch (error) {
        console.log({ error });
      }
    }
  };

  useEffect(() => {
    if (inputValue !== selectedDirection?.description) {
      setOptions([]);
      setSelectedDirection(null);
    }
  }, [inputValue]);

  // ocultar opciones
  useEffect(() => {
    if (options.length === 0) {
      document
        .querySelector(".MuiAutocomplete-popper")
        ?.classList.add("withoutOptions");
    } else {
      document
        .querySelector(".MuiAutocomplete-popper")
        ?.classList.remove("withoutOptions");
    }
  }, [options]);

  useEffect(() => {
    selectedDirection?.place_id && searchLatLngByPlaceId();
  }, [selectedDirection, window?.google]);

  const buscarDireccion = () => {
    let active = true;
    if (
      inputValue
        .trim()
        .replaceAll(",", "")
        .split(" ")
        .every((s) => isNaN(Number(s)))
    ) {
      toast.error("Favor ingresar numeración");
      return;
    }
    setIsError(false);

    if (!autocompleteService.current && (window as any)?.google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(selectedDirection ? [selectedDirection] : []);
      return undefined;
    }

    // obtener latlng

    // verificar que tenga numeración
    if (inputValue.split(" ").length > 1) {
      const inputToModify = inputValue;
      const lastElement = inputToModify.split(" ");
      if (!lastElement?.some((e) => e.split("").some((i) => !isNaN(+i)))) {
        setOptions([]);
        return undefined;
      }
    }
    const myLatlng = new google.maps.LatLng(
      -33.50192302037071,
      -70.77684154312749
    );

    fetch(
      {
        input: inputValue,
        componentRestrictions: { country: ["cl"] },
        lenguage: "es",
        fields: ["address_component", "geometry"],
        types: ["address"],
        // origin: { lat: -33.50192302037071, lng: -70.77684154312749 },
        location: myLatlng,
        radius: 3000,
      } as any,
      (results) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];

          if (selectedDirection) {
            newOptions = [selectedDirection];
          }
          if (results) {
            newOptions = [/* ...newOptions,  */ ...results];
          }
          setOptions(newOptions);
        }
      }
    );

    (document.querySelector(
      ".MuiAutocomplete-popupIndicator"
    ) as HTMLElement)!.click();
    return () => {
      active = false;
    };
  };

  const isSameInputWithCart = () => {
    if (addressFound) {
      return true;
    }
    if (selectedDirection) {
      if (inputValue !== selectedDirection?.description) {
        return false;
      }
      return true;
    } else if (!selectedDirection) {
      if (!shippingAddress) {
        return false;
      }
      if (shippingAddress && inputValue !== shippingAddress.address) {
        return false;
      }
    }
    return true;
  };
  shippingAddress && inputValue !== shippingAddress.address;
  return (
    <>
      <Box display={"flex"}>
        <Autocomplete
          disablePortal={options.length === 0}
          inputValue={inputValue}
          disabled={disableInput}
          fullWidth
          clearOnBlur={false}
          clearOnEscape={false}
          id="google-map-demo"
          // sx={{ width: 300 }}
          getOptionLabel={(option: PlaceType) =>
            typeof option === "string" ? option : option.description
          }
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={selectedDirection}
          onChange={(event: any, newValue: PlaceType | null) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setSelectedDirection(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              required
              {...params}
              variant="standard"
              label="Ingrese dirección"
              sx={{ width: "100%" }}
              {...register("address", {
                required: "Debe agregar direccion",
                validate: {
                  required: () => {
                    if (!isSameInputWithCart())
                      return "Para agregar dirección (o modificar), presionar botón 'Buscar', y seleccionar opción deseada de lista desplegable, de lo contrario no podrá continuar";
                  },
                },
              })}
              error={!!errors.address}
              helperText={errors?.address?.message}
            />
          )}
          renderOption={(props, option: any) => {
            const matches =
              option.structured_formatting.main_text_matched_substrings;
            const parts = parse(
              option.structured_formatting.main_text,
              matches.map((match: any) => [
                match.offset,
                match.offset + match.length,
              ])
            );

            return (
              <li {...props}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Box
                      component={LocationOnIcon}
                      sx={{ color: "text.secondary", mr: 2 }}
                    />
                  </Grid>
                  <Grid item xs>
                    {parts.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                    <Typography variant="body2" color="text.secondary">
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
        {/* <IconButton
        disabled={disableInput}
        size="large"
        type="button"
        onClick={buscarDireccion}
        color="primary"
      >
        <SearchOutlined />
      </IconButton> */}
        <Button
          disabled={disableInput}
          size="small"
          type="button"
          onClick={buscarDireccion}
          color="primary"
        >
          Buscar
        </Button>
      </Box>
      {(coords as any)?.lat && (coords as any)?.lng && (
        <Box className="fadeIn" mt={2}>
          <GoogleMap
            id="marker-example"
            mapContainerStyle={mapContainerStyle}
            zoom={16}
            center={{ lat: (coords as any).lat, lng: (coords as any).lng }}
            // center={{ lat: -33.5183808601021, lng: -70.76766249137242 }}
          >
            {" "}
            {
              <Marker
                position={{
                  lat: (coords as any).lat,
                  lng: (coords as any).lng,
                }}
              />
            }
          </GoogleMap>
        </Box>
      )}
    </>
  );
};
