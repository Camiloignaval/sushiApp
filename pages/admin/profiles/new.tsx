import { PeopleOutline, PhoneAndroidOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { AdminLayout } from "../../../components/layouts";
import { useNewAdminUserMutation } from "../../../store/RTKQuery/adminApi";
// import { useRegisterMutation } from "../../../store/RTKQuery/authApi";
import { validations } from "../../../utils";

type FormData = {
  name: string;
  userName: string;
  phone: string;
  role: string;
  password: string;
  password2?: string;
};

const NewAdminUser = () => {
  const router = useRouter();
  const [newAdminUser, newAdminUserStatus] = useNewAdminUserMutation();
  // const [doRegister, registerState] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const destination = useMemo(
    () => router.query?.p?.toString() || "/",
    [router]
  );

  // useEffect(() => {
  //   registerState.isSuccess && router.replace(destination);
  // }, [registerState.isSuccess, router]);

  const onRegisterUser = async (data: FormData) => {
    try {
      delete data.password2;
      data.phone = `+56${data.phone}`;
      console.log({ data });
      await newAdminUser(data).unwrap();
      router.push("/admin/profiles");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue(
      "userName",
      `${getValues("name").toLocaleUpperCase().trim().replaceAll(" ", "")}`
    );
  }, [watch("name")]);

  return (
    <AdminLayout
      icon={<PeopleOutline />}
      title={"Administradores"}
      subTitle={"Creación de nuevo usuario"}
    >
      <form onSubmit={handleSubmit(onRegisterUser)}>
        <Box justifyItems="center" mt={6}>
          <Grid container spacing={2}>
            <Grid item container rowGap={3} xs={12} md={6}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  variant="standard"
                  fullWidth
                  inputProps={{ style: { textTransform: "capitalize" } }}
                  autoComplete="off"
                  {...register("name", {
                    required: "Este campo es requerido",
                    minLength: {
                      value: 2,
                      message: "Nombre debe tener minimo 2 caracteres",
                    },
                  })}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="UserName"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  variant="standard"
                  fullWidth
                  {...register("userName", {
                    required: "Este campo es requerido",
                    minLength: {
                      value: 2,
                      message: "Nombre debe tener minimo 2 caracteres",
                    },
                  })}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Cargo</InputLabel>

                  <Select
                    error={!!errors?.role}
                    inputProps={register("role", {
                      required: "Seleccione cargo",
                    })}
                    label="Cargo"
                  >
                    <MenuItem value={"admin"}>Administrador</MenuItem>
                    <MenuItem value={"delivery"}>Delivery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item container xs={12} md={6} rowGap={3}>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneAndroidOutlined />
                        +56
                      </InputAdornment>
                    ),
                  }}
                  label="Teléfono"
                  type="phone"
                  variant="standard"
                  fullWidth
                  {...register("phone", {
                    required: "Este campo es requerido",
                    pattern: {
                      value: /^(\s?)(0?9)(\s?)[98765432]\d{7}$/,
                      message: "Debe ser un numero válido (+569xxxxxxxx)",
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña"
                  type="password"
                  variant="standard"
                  fullWidth
                  {...register("password", {
                    required: "Este campo es requerido",
                    minLength: {
                      value: 6,
                      message: "Contraseña debe tener minimo 6 caracteres",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Repita contraseña"
                  type="password"
                  variant="standard"
                  fullWidth
                  {...register("password2", {
                    required: "Este campo es requerido",
                    validate: (value) => {
                      if (value !== getValues("password")) {
                        return "Contraseñas deben  ser iguales";
                      }
                    },
                    minLength: {
                      value: 6,
                      message: "Contraseña debe tener minimo 6 caracteres",
                    },
                  })}
                  error={!!errors.password2}
                  helperText={errors?.password2?.message}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                disabled={newAdminUserStatus.isLoading}
                className="circular-btn"
                color="secondary"
                fullWidth
                size="large"
                sx={{ marginTop: 5 }}
                type="submit"
              >
                Crear usuario
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AdminLayout>
  );
};

export default NewAdminUser;
