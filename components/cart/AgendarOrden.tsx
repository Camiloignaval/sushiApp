import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addHours, format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetSettingsStoreQuery } from "../../store/RTKQuery/settings";
import { reserveHour } from "../../store/Slices/CartSlice";
import { analizeIfIsPossibleReserve } from "../../utils/analizeIfIsPossibleReserve";

interface Props {
  setShowReserveHour: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AgendarOrden: FC<Props> = ({ setShowReserveHour }) => {
  const { data: settingsData } = useGetSettingsStoreQuery();
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state);
  const [value, setValue] = React.useState<any>(
    cart?.reservedHour
      ? format(new Date(cart?.reservedHour), "yyyy-MM-dd HH:mm")
      : format(new Date(), "yyyy-MM-dd HH:mm")
  );
  //   format(new Date(), "yyyy-MM-dd HH:mm");
  const [errorMessage, setErrorMessage] = useState<{
    value: boolean;
    message: string;
  } | null>(null);

  const handleAnalizeSchedule = async () => {
    if (!settingsData || !value) {
      setErrorMessage({
        value: false,
        message: "No ha sido posible analizar hora",
      });
      return;
    }
    try {
      const respReserve = analizeIfIsPossibleReserve(settingsData, value);
      setErrorMessage(respReserve);
      if (respReserve.value === true) {
        const dateToSend = new Date(value).toISOString();
        dispatch(reserveHour(dateToSend));
        setShowReserveHour(false);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Box display={"flex"} flexDirection="column">
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, textDecoration: "underline" }}
        >
          A tener en cuenta:
        </Typography>
        <Typography variant="caption">
          - Pedir con un mínimo de 2 horas de anticipación
        </Typography>
        <Typography variant="caption">
          - Podrá agendar para pasado 1 hora de la hora de apertura
        </Typography>
      </Box>
      <Grid container mt={2}>
        <Grid item xs={8}>
          {/* DateTimePicker causa error en components */}
          <DateTimePicker
            disableMaskedInput
            disablePast
            inputFormat={"dd-MM-yyyy HH:mm"}
            label="Seleccione Fecha y Hora"
            renderInput={(params) => <TextField {...params} fullWidth />}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </Grid>
        <Grid xs={4} display={"flex"} item>
          <Button
            onClick={handleAnalizeSchedule}
            fullWidth
            sx={{ marginX: 2 }}
            color="primary"
            size="large"
          >
            Agendar
          </Button>
        </Grid>
        {errorMessage?.value === false && (
          <Typography variant="caption" color="error">
            {errorMessage.message}
          </Typography>
        )}
      </Grid>
    </LocalizationProvider>
  );
};
