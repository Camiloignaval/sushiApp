import React, { useState } from "react";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { esES } from "@mui/x-date-pickers";
import { es } from "date-fns/locale";

export const useDatePicker = ({ label = "Seleccione" }) => {
  const [value, setValue] = useState<any>(null);

  const DatePickerSelect = () => (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={
        esES.components.MuiLocalizationProvider.defaultProps.localeText
      }
      locale={es}
    >
      <DatePicker
        disableFuture
        label={label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            sx={{ display: "flex", alignSelf: "center", marginRight: 1 }}
            size="small"
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );

  return [DatePickerSelect, value, setValue] as const;
};
