import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../components/layouts";
import { useLogInMutation } from "../store/RTKQuery/authApi";

type FormData = {
  userName: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [logIn, loginState] = useLogInMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const destination = useMemo(
    () => router.query?.p?.toString() || "/admin",
    [router]
  );

  useEffect(() => {
    loginState.isSuccess && router.replace(destination);
  }, [loginState.isSuccess, router]);

  const onLoginUser = async ({ userName, password }: FormData) => {
    logIn({ userName, password });
  };

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Grid container>
          <Grid
            position={"absolute"}
            zIndex={-1}
            left={"50%"}
            height={"50%"}
            item
            xs={12}
            display="flex"
            justifyContent={"center"}
            sx={{ opacity: 0.1, transform: "translate(-50%,-30%)" }}
          >
            <Image
              src="/logos/logo-sushi-panko.webp"
              height={"800px"}
              width={"800px"}
              loading={"eager"}
            />
          </Grid>{" "}
          <Grid item xs={12} display="flex" justifyContent={"center"}>
            <Box
              justifyItems="center"
              sx={{ width: 350, padding: "10px 20px" }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    display="flex"
                    justifyContent={"center"}
                    variant="h1"
                    component="h1"
                  >
                    Iniciar sesión
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <TextField
                    autoComplete="off"
                    type="text"
                    label="Nombre de usuario"
                    fullWidth
                    {...register("userName", {
                      required: "Este campo es requerido",
                    })}
                    error={!!errors.userName}
                    helperText={errors?.userName?.message}
                  />
                </Grid>
                <Grid item xs={12} mt={2}>
                  <TextField
                    autoComplete="off"
                    label="Contraseña"
                    type="password"
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
                  <Button
                    disabled={loginState.isLoading}
                    type="submit"
                    className="circular-btn"
                    color="secondary"
                    fullWidth
                    size="large"
                    sx={{ marginTop: 5 }}
                  >
                    Iniciar sesión
                  </Button>
                </Grid>
                <Grid
                  marginTop={2}
                  item
                  xs={12}
                  display="flex"
                  justifyContent="end"
                >
                  {/* <NextLink href={`/auth/register?p=${destination}`} passHref>
                <Link underline="always">No tienes cuenta?</Link>
              </NextLink> */}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   query,
// }) => {
//   const session = false; /*  await getSession({ req }); */
//   const { p = "/" } = query;
//   if (session) {
//     return {
//       redirect: {
//         destination: p.toString(),
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default LoginPage;
