import React, { ChangeEvent, FC, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";

const link = "https://api.cloudinary.com/v1_1/dc6vako2z/image/upload";

import { AdminLayout, ShopLayout } from "../../../components/layouts";
import { dbProducts } from "../../../database";
import { IFillingType, IProduct, IType } from "../../../interfaces";
import { Controller, useForm } from "react-hook-form";
import {
  CategoryOutlined,
  PlaylistAddCheckCircleOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {
  Box,
  Grid,
  TextField,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  capitalize,
  Chip,
  Card,
  CardMedia,
  CardActions,
  Button,
  Switch,
  Typography,
} from "@mui/material";
import { useUpdateProductMutation } from "../../../store/RTKQuery/productsApi";
import toast from "react-hot-toast";
import { useUploadFilesMutation } from "../../../store/RTKQuery/uploadApi";
import axios from "axios";
import { useRouter } from "next/router";

const validTypes = [
  { code: "envelope", friendly: "envoltura" },
  { code: "filling", friendly: "relleno" },
  { code: "sauce", friendly: "salsa" },
  { code: "other", friendly: "otros" },
];
const validFillingTypes = [
  { code: "protein", friendly: "proteina" },
  { code: "vegetable", friendly: "vegetal" },
];

interface FormData {
  image?: string;
  inStock?: boolean;
  price?: number;
  name?: string;
  type?: string;
  fillingType?: string;
}

const NewProductPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFiles] = useUploadFilesMutation();
  const [updateProduct, updateProductState] = useUpdateProductMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    control,
  } = useForm<FormData>();

  useEffect(() => {
    if (getValues("type") !== "filling") {
      setValue("fillingType", undefined);
    }
  }, [getValues("type")]);

  const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) return;
    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "suzlp5k5");
        const {
          data: { secure_url },
        } = await axios.post(link, formData);
        setValue("image", secure_url, {
          shouldValidate: true,
        });
      }
      toast.success("Imágen cargada con éxito");
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error subiendo las imágenes..");
    }
  };

  const onSubmit = (formData: FormData) => {
    if (formData.type === "filling" && !formData.fillingType)
      return toast.error("Debe seleccionar un tipo de relleno");
    if (!formData.image) return toast.error("Debe seleccionar una imágen");
    if (!formData.type)
      return toast.error("Debe seleccionar un tipo de producto");
    updateProduct(formData)
      .unwrap()
      .then(() => {
        router.replace("/admin/products");
      });
    return true;
  };
  return (
    <AdminLayout
      icon={<PlaylistAddIcon />}
      title={`Nuevo producto`}
      subTitle={"Mantenimiento de productos"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            disabled={updateProductState.isLoading}
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("name", {
                required: "Este campo es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("price", {
                required: "Este campo es requerido",
                minLength: { value: 0, message: "Mínimo de valor 0" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <FormControl>
              <FormControlLabel
                label="En Stock"
                labelPlacement="start"
                control={
                  <Switch
                    onChange={(e) =>
                      setValue("inStock", e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    defaultChecked
                    checked={getValues("inStock")}
                  />
                }
              />
            </FormControl>

            <Divider sx={{ my: 1 }} />
            {/* tipo de producto */}
            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>

              <RadioGroup
                row
                value={getValues("type")}
                onChange={({ target }) =>
                  setValue("type", target.value as IType, {
                    shouldValidate: true,
                  })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option.code}
                    value={option.code}
                    control={<Radio color="secondary" />}
                    label={capitalize(option.friendly)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* tipo de relleno */}
            {getValues("type") === "filling" && (
              <FormControl sx={{ mb: 1, width: "100%" }}>
                <FormLabel>Tipo de relleno</FormLabel>

                <RadioGroup
                  row
                  value={getValues("fillingType")}
                  onChange={({ target }) =>
                    setValue("fillingType", target.value as IFillingType, {
                      shouldValidate: true,
                    })
                  }
                >
                  {validFillingTypes.map((option) => (
                    <FormControlLabel
                      key={option.code}
                      value={option.code}
                      control={<Radio color="secondary" />}
                      label={capitalize(option.friendly)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            <Divider sx={{ my: 2, display: { xs: "flex", sm: "none" } }} />
          </Grid>
          <Grid item xs={12} sm={6} container spacing={2}>
            {getValues("image") && (
              <Grid className="fadeIn" item xs={12} sm={12}>
                <Card>
                  <CardMedia
                    component="img"
                    className="fadeIn"
                    image={getValues("image")}
                    alt={"Imagen producto"}
                    sx={{ width: "100%" }}
                  />
                </Card>
              </Grid>
            )}
            <Grid item xs={12} display="flex" flexDirection="column">
              <Button
                color="secondary"
                startIcon={<UploadOutlined />}
                fullWidth
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Cargar imágen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
                onChange={onFilesSelected}
              />

              {!getValues("image") && (
                <Chip
                  label="Es necesario subir 1 imágen"
                  color="error"
                  variant="outlined"
                />
              )}
            </Grid>
            {/* ))} */}
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export default NewProductPage;
