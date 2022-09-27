import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { getSession, signIn, getProviders } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts";
import { useLogInMutation } from "../../store/RTKQuery/authApi";
import { validations } from "../../utils";
import { GetServerSideProps } from "next";

type FormData = {
  email: string;
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
    () => router.query?.p?.toString() || "/",
    [router]
  );

  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  useEffect(() => {
    loginState.isSuccess && router.replace(destination);
  }, [loginState.isSuccess, router]);

  const onLoginUser = async ({ email, password }: FormData) => {
    // logIn({ email, password });
    // * linea para nexauth
    signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box justifyItems="center" sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar sesión
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="standard"
                fullWidth
                {...register("email", {
                  required: "Este campo es requerido",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors?.email?.message}
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
              <NextLink href={`/auth/register?p=${destination}`} passHref>
                <Link underline="always">No tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const { p = "/" } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
