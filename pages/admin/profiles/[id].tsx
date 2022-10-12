import { PeopleOutline, PhoneAndroidOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminLayout } from "../../../components/layouts";
import { dbUsers } from "../../../database";
import { IUser } from "../../../interfaces";
import {
  useNewAdminUserMutation,
  useUpdateAdminUserMutation,
} from "../../../store/RTKQuery/adminApi";

type FormData = {
  _id?: string;
  name: string;
  userName: string;
  phone: string;
  role: string;
  password: string | undefined;
  password2?: string | undefined;
  isEnabled: boolean;
};

interface Props {
  user: IUser;
}

const EditAdminUser: FC<Props> = ({ user }) => {
  const router = useRouter();
  const [updateAdminUser, updateAdminUserStatus] = useUpdateAdminUserMutation();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      ...user,
      phone: user.phone.replace("+56", ""),
    },
  });

  const onEditUser = async (data: FormData) => {
    try {
      data.password = data.password !== "" ? data.password : undefined;
      delete data.password2;
      data.phone = `+56${data.phone}`;
      console.log({ data });
      await updateAdminUser(data).unwrap();
      //   router.push("/admin/profiles");
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
      <form onSubmit={handleSubmit(onEditUser)}>
        <Box justifyItems="center" mt={6}>
          <Grid container spacing={2}>
            <Grid item container rowGap={3} xs={12} md={6}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  disabled
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
                  disabled
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
                    defaultValue={getValues("role")}
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
                  label="Nueva contraseña (Solo si desea cambiarla)"
                  type="password"
                  variant="standard"
                  fullWidth
                  {...register("password", {
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
                  label="Repita nueva contraseña"
                  type="password"
                  variant="standard"
                  fullWidth
                  {...register("password2", {
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
            <Grid item xs={12} display="flex" justifyContent={"end"}>
              <FormControl>
                <FormControlLabel
                  label="Activo"
                  labelPlacement="top"
                  control={
                    <Switch
                      checked={getValues("isEnabled")}
                      onChange={(e) =>
                        setValue("isEnabled", e.target.checked, {
                          shouldValidate: true,
                        })
                      }
                    />
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                disabled={updateAdminUserStatus.isLoading}
                className="circular-btn"
                color="secondary"
                fullWidth
                size="large"
                sx={{ marginTop: 5 }}
                type="submit"
              >
                Actualizar usuario
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = "" } = query;
  const user = await dbUsers.findAdminUser(id.toString());

  if (!user) {
    return {
      redirect: {
        destination: `/admin/profiles`,
        permanent: false,
      },
    };
  }
  return {
    props: { user },
  };
};

export default EditAdminUser;
