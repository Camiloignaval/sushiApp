import {
  ArrowForward,
  PhoneAndroidOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  Grid,
  TextField,
  InputAdornment,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  Stack,
  Box,
  Button,
} from "@mui/material";
import { isValidPhoneNumber } from "libphonenumber-js";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AdminLayout } from "../../components/layouts";
import { styled } from "@mui/material/styles";
import { IShippingAdress } from "../../interfaces";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SettingsSchedule } from "../../components/SettingsSchedule";

const daysArray = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export interface ISettings {
  lunes: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  martes: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  miercoles: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  jueves: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  viernes: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  sabado: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
  domingo: {
    open: boolean;
    scheduleOpen: string;
    scheduleClose: string;
  };
}

const SettingsPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ISettings>();

  //   useEffect(() => {
  //     console.log({ lunes: getValues("lunes.open") });
  //   }, []);

  const onSubmit = (formData: ISettings) => {
    console.log({ formData });
  };

  return (
    <AdminLayout
      title="Configuraciones"
      icon={<SettingsOutlined />}
      subTitle="Administrador de tienda"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* lado izq horarios */}
          <Grid container mt={4}>
            <Grid
              container
              display={"flex"}
              alignItems={"center"}
              item
              xs={12}
              lg={6}
              rowSpacing={2}
            >
              {/* Dias */}
              {/* Lunes */}

              {daysArray.map((d) => (
                <SettingsSchedule
                  getValues={getValues}
                  setValue={setValue}
                  d={d}
                  key={d}
                />
              ))}
              {/* martes */}
            </Grid>
          </Grid>
        </LocalizationProvider>
        <Button type="submit">Enviar</Button>
      </form>
    </AdminLayout>
  );
};

export default SettingsPage;

// <>
//                   <Grid item xs={3}>
//                     <Typography textTransform={"capitalize"}>{d}</Typography>
//                   </Grid>
//                   <Grid item xs={2}>
//                     <TimePicker
//                       disabled={getValues('lunes.open')}
//                       // label="Basic example"
//                       value={getValues("lunes.scheduleOpen")}
//                       onChange={(newValue) => {
//                         setValue("lunes.scheduleOpen", newValue!, {
//                           shouldValidate: true,
//                         });
//                       }}
//                       renderInput={(params: any) => <TextField {...params} />}
//                     />
//                   </Grid>
//                   <Grid item xs={1} display="flex" justifyContent={"center"}>
//                     <ArrowForward />
//                   </Grid>
//                   <Grid item xs={2}>
//                     <TimePicker
//                       disabled={getValues("lunes.open")}
//                       // label="Basic example"
//                       value={getValues("lunes.scheduleClose")}
//                       onChange={(newValue) => {
//                         setValue("lunes.scheduleClose", newValue!, {
//                           shouldValidate: true,
//                         });
//                       }}
//                       renderInput={(params: any) => <TextField {...params} />}
//                     />
//                   </Grid>
//                   <Grid
//                     item
//                     xs={2}
//                     sx={{ display: "flex", justifyContent: "center" }}
//                   >
//                     <FormControl>
//                       <Switch
//                         onChange={(e) =>
//                           setValue("lunes.open", e.target.checked, {
//                             shouldValidate: true,
//                           })
//                         }
//                         checked={getValues("lunes.open")}
//                       />
//                     </FormControl>
//                   </Grid>
//                 </>
