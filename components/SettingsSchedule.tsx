import { ArrowForward } from "@mui/icons-material";
import {
  FormControl,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import React, { FC, useEffect } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { ISettings } from "../pages/admin/settings";

interface Props {
  getValues: UseFormGetValues<ISettings>;
  setValue: UseFormSetValue<ISettings>;
  d: string;
}

export const SettingsSchedule: FC<Props> = ({ getValues, setValue, d }) => {
  const diaOpen = `${d}.open`;
  const diaScheduleOpen = `${d}.scheduleOpen`;
  const diaScheduleClose = `${d}.scheduleClose`;

  useEffect(() => {}, [getValues(diaOpen)]);

  return (
    <>
      <Grid item xs={3}>
        <Typography textTransform={"capitalize"}>{d}</Typography>
      </Grid>
      <Grid item xs={2}>
        <TimePicker
          disabled={getValues(diaOpen)}
          // label="Basic example"
          value={getValues(diaScheduleOpen)}
          onChange={(newValue) => {
            setValue(diaScheduleOpen, newValue!, {
              shouldValidate: true,
            });
          }}
          renderInput={(params: any) => <TextField {...params} />}
        />
      </Grid>
      <Grid item xs={1} display="flex" justifyContent={"center"}>
        <ArrowForward />
      </Grid>
      <Grid item xs={2}>
        <TimePicker
          disabled={getValues(diaOpen)}
          // label="Basic example"
          value={getValues(diaScheduleClose)}
          onChange={(newValue) => {
            setValue(diaScheduleClose, newValue!, {
              shouldValidate: true,
            });
          }}
          renderInput={(params: any) => <TextField {...params} />}
        />
      </Grid>
      <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
        <FormControl>
          <Switch
            onChange={(e) =>
              setValue(diaOpen, e.target.checked, {
                shouldValidate: true,
              })
            }
            checked={getValues(diaOpen)}
          />
        </FormControl>
      </Grid>
    </>
  );
};
