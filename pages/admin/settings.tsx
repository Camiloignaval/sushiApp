import {
  ArrowForward,
  CalendarMonthOutlined,
  DeliveryDiningOutlined,
  EditLocationAlt,
  EditNotificationsOutlined,
  SaveOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  Switch,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { dbSettings } from "../../database";
import React, { FC } from "react";
// import { Space, TimePicker as TimePickerAntd } from "antd";
import { useForm } from "react-hook-form";
import { AdminLayout } from "../../components/layouts";
import { ISettingsStore } from "../../interfaces";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useGetSettingsStoreQuery,
  useUpdateConfigMutation,
} from "../../store/RTKQuery/settings";
import { FullScreenLoading } from "../../components/ui";

interface Props {
  settings: ISettingsStore;
}

const SettingsPage: FC<Props> = ({ settings }) => {
  const [updateSettings] = useUpdateConfigMutation();
  const { data, isLoading } = useGetSettingsStoreQuery();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ISettingsStore>({
    defaultValues: settings,
  });

  const onSubmit = (formData: ISettingsStore) => {
    updateSettings(formData);
  };

  if (!data) return <FullScreenLoading />;
  return (
    <AdminLayout
      title="Configuraciones"
      icon={<SettingsOutlined />}
      subTitle="Administrador de tienda"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            // disabled={updateCouponState.isLoading}
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
          >
            Guardar
          </Button>
        </Box>
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
              <Typography variant="h6" width={"100%"} display="flex">
                <CalendarMonthOutlined sx={{ mr: 2 }} />
                Horarios
              </Typography>
              {/* Dias */}
              {/* Lunes */}

              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Lunes</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("lunes.open")}
                  // label="Basic example"
                  value={getValues("lunes.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("lunes.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("lunes.open")}
                  // label="Basic example"
                  value={getValues("lunes.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("lunes.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("lunes.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("lunes.open")}
                  />
                </FormControl>
              </Grid>

              {/* martes */}
              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Martes</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("martes.open")}
                  // label="Basic example"
                  value={getValues("martes.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("martes.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("martes.open")}
                  // label="Basic example"
                  value={getValues("martes.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("martes.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("martes.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("martes.open")}
                  />
                </FormControl>
              </Grid>
              {/* miercoles */}
              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Miercoles</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("miercoles.open")}
                  // label="Basic example"
                  value={getValues("miercoles.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("miercoles.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("miercoles.open")}
                  // label="Basic example"
                  value={getValues("miercoles.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("miercoles.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("miercoles.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("miercoles.open")}
                  />
                </FormControl>
              </Grid>
              {/* jueves */}
              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Jueves</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("jueves.open")}
                  // label="Basic example"
                  value={getValues("jueves.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("jueves.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("jueves.open")}
                  // label="Basic example"
                  value={getValues("jueves.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("jueves.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("jueves.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("jueves.open")}
                  />
                </FormControl>
              </Grid>
              {/* viernes */}
              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Viernes</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("viernes.open")}
                  // label="Basic example"
                  value={getValues("viernes.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("viernes.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("viernes.open")}
                  // label="Basic example"
                  value={getValues("viernes.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("viernes.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("viernes.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("viernes.open")}
                  />
                </FormControl>
              </Grid>
              {/* sabado */}
              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Sabado</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("sabado.open")}
                  // label="Basic example"
                  value={getValues("sabado.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("sabado.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("sabado.open")}
                  // label="Basic example"
                  value={getValues("sabado.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("sabado.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("sabado.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("sabado.open")}
                  />
                </FormControl>
              </Grid>
              {/* domingo */}
              <Grid item xs={3}>
                <Typography textTransform={"capitalize"}>Domingo</Typography>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("domingo.open")}
                  // label="Basic example"
                  value={getValues("domingo.scheduleOpen")}
                  onChange={(newValue) => {
                    setValue("domingo.scheduleOpen", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={1} display="flex" justifyContent={"center"}>
                <ArrowForward />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  disabled={!getValues("domingo.open")}
                  // label="Basic example"
                  value={getValues("domingo.scheduleClose")}
                  onChange={(newValue) => {
                    setValue("domingo.scheduleClose", newValue!, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <Switch
                    onChange={(e) =>
                      setValue("domingo.open", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    checked={getValues("domingo.open")}
                  />
                </FormControl>
              </Grid>
              {/* forzar apertura */}
              <Grid item xs={12}></Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle2" color="error">
                  Forzar apertura
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Switch
                  disabled={getValues("forceClose")}
                  onChange={(e) =>
                    setValue("forceOpen", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  checked={getValues("forceOpen")}
                />
              </Grid>
              {/* forzar cierre */}
              <Grid item xs={3}>
                <Typography variant="subtitle2" color="error">
                  Forzar cierre
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Switch
                  disabled={getValues("forceOpen")}
                  onChange={(e) =>
                    setValue("forceClose", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  checked={getValues("forceClose")}
                />
              </Grid>
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mr: 4,
                width: "1px",
                display: "flex",
              }}
            />

            <Grid
              container
              display={"flex"}
              // alignItems={"center"}
              columnSpacing={2}
              item
              xs={12}
              lg={5}
              rowSpacing={2}
            >
              <Grid xs={12} item>
                <Divider sx={{ my: 2, display: { xs: "block", lg: "none" } }} />
                <Typography variant="h6" width={"100%"} display="flex">
                  <DeliveryDiningOutlined sx={{ mr: 2 }} />
                  Delivery
                </Typography>
              </Grid>
              <Grid xs={12} item>
                <TextField
                  label="Precio por Kilometro"
                  variant="filled"
                  type={"number"}
                  fullWidth
                  sx={{ mb: 1 }}
                  {...register("kmPrice", {
                    required: "Este campo es requerido",
                    min: {
                      value: 0,
                      message: "Valor no puede ser inferior a 0",
                    },
                  })}
                  error={!!errors.kmPrice}
                  helperText={errors.kmPrice?.message}
                />
              </Grid>
              {/* custom roll */}
              <Grid xs={12} item>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" width={"100%"} display="flex">
                  <EditIcon sx={{ mr: 2 }} />
                  Roll personalizado
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Proteinas"
                  variant="filled"
                  type={"number"}
                  fullWidth
                  sx={{ mb: 1 }}
                  {...register("customRoll.proteins", {
                    required: "Este campo es requerido",
                    min: { value: 1, message: "Debe ser minimo 1" },
                  })}
                  error={!!errors.customRoll!?.proteins}
                  helperText={errors.customRoll!?.proteins?.message}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Vegetales"
                  variant="filled"
                  type={"number"}
                  sx={{ mb: 1 }}
                  {...register("customRoll.vegetables", {
                    required: "Este campo es requerido",
                    min: { value: 1, message: "Debe ser minimo 1" },
                  })}
                  error={!!errors.customRoll!?.vegetables}
                  helperText={errors.customRoll!?.vegetables?.message}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Salsas"
                  variant="filled"
                  type={"number"}
                  sx={{ mb: 1 }}
                  {...register("customRoll.sauces", {
                    required: "Este campo es requerido",
                    min: { value: 1, message: "Debe ser minimo 1" },
                  })}
                  error={!!errors.customRoll!?.sauces}
                  helperText={errors.customRoll!?.sauces?.message}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Extras"
                  variant="filled"
                  type={"number"}
                  sx={{ mb: 1 }}
                  {...register("customRoll.extraProducts", {
                    required: "Este campo es requerido",
                    min: { value: 1, message: "Debe ser minimo 1" },
                  })}
                  error={!!errors.customRoll!?.extraProducts}
                  helperText={errors.customRoll!?.extraProducts?.message}
                />
              </Grid>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const settings = await dbSettings.getSettings();

  if (!settings) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };
  }

  return {
    props: {
      settings,
    },
  };
};

export default SettingsPage;
