import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";

const link = "https://api.cloudinary.com/v1_1/dc6vako2z/image/upload";

import { ShopLayout } from "../../../components/layouts";
import { dbCategories, dbProducts, dbPromotions } from "../../../database";
import {
  ICategory,
  IFillingType,
  IProduct,
  IPromotion,
  IType,
} from "../../../interfaces";
import { useForm } from "react-hook-form";
import { Category, SaveOutlined, UploadOutlined } from "@mui/icons-material";
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
  MenuItem,
  Select,
} from "@mui/material";
import { useUpdateProductMutation } from "../../../store/RTKQuery/productsApi";
import toast from "react-hot-toast";
import { useUploadFilesMutation } from "../../../store/RTKQuery/uploadApi";
import axios from "axios";
import { useRouter } from "next/router";
import { TextareaAutosize } from "@mui/base";
import { useUpdatePromotionMutation } from "../../../store/RTKQuery/promotionApi";

interface Props {
  promotion: IPromotion;
  categories: ICategory[];
}

const units = ["Piezas", "Porciones", "Rolls"];

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
  promotionItems: string[];
  price: number;
  inOffer: boolean;
  inStock: boolean;
  description: string;
  images: string[];
  name: string;
  offerPrice?: number;
  category: ICategory;
  quantity: number;
  unit: string;
  _id?: string;
}

const OrderInfoPage: FC<Props> = ({ promotion, categories }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newItemValue, setNewItemValue] = useState("");

  const [updatePromotion, updatePromotionState] = useUpdatePromotionMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: promotion,
  });

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
        setValue("images", [...getValues("images"), secure_url], {
          shouldValidate: true,
        });
      }
      toast.success("Imágen cargada con éxito");
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error subiendo las imágenes..");
    }
  };

  const onDeleteImage = (img: string) => {
    console.log({ img });
    // TODO BORRAR DE CLOUDINARY
    setValue(
      "images",
      getValues("images").filter((i) => i !== img),
      { shouldValidate: true }
    );
  };

  const onAddItems = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.code !== "Period") return;
    if (newItemValue === "") return;
    if (getValues("promotionItems").includes(newItemValue.trim())) return;

    setValue(
      "promotionItems",
      [...getValues("promotionItems"), newItemValue.trim()],
      {
        shouldValidate: true,
      }
    );
    setNewItemValue("");
    return;
  };

  const onDeleteTag = (tag: string) => {
    console.log({ eliminare: tag });
    setValue(
      "promotionItems",
      getValues("promotionItems").filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  useEffect(() => {
    console.log({ ahora: getValues("promotionItems") });
  }, [getValues("promotionItems")]);

  const onSubmit = (formData: FormData) => {
    if (getValues("inOffer")) {
      if (getValues("offerPrice")! > getValues("price")) {
        toast.error("El valor oferta es mayor al actual, favor verifique");
        return;
      }
    }
    console.log({ formData });

    updatePromotion(formData)
      .unwrap()
      .then(() => {
        router.replace("/admin/promotions");
      });
    return true;
  };
  return (
    <ShopLayout
      title={"Sigue tu pedido"}
      pageDescription={"Pagina para seguir el estado del pedido"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            disabled={updatePromotionState.isLoading}
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
              label="Descripción"
              variant="filled"
              fullWidth
              minRows={2}
              sx={{ mb: 1 }}
              {...register("description", {
                required: "Este campo es requerido",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
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

            <Divider sx={{ my: 1 }} />
            {/* tipo de producto */}
            <FormControl fullWidth sx={{ mb: 1 }}>
              <FormLabel>Categoría</FormLabel>
              <Select
                value={getValues("category")}
                label="Categoría"
                onChange={({ target: { value } }) =>
                  setValue("category", value as any, { shouldValidate: true })
                }
              >
                {categories.map((cat: ICategory) => (
                  <MenuItem value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <FormLabel>Cantidad</FormLabel>
                  <TextField
                    type="number"
                    variant="filled"
                    fullWidth
                    sx={{ mb: 1 }}
                    {...register("quantity", {
                      required: "Este campo es requerido",
                      minLength: { value: 0, message: "Mínimo de valor 0" },
                    })}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                </FormControl>
              </Grid>
              <Grid item xs>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <FormLabel>Tipo de unidad</FormLabel>
                  <Select
                    value={getValues("unit")}
                    label="Categoría"
                    onChange={({ target: { value } }) =>
                      setValue("unit", value as any, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {units.map((unit) => (
                      <MenuItem value={unit}>{unit}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container>
              <Grid
                item
                xs={6}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                {" "}
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
                        checked={getValues("inStock")}
                      />
                    }
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={6}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                {" "}
                <FormControl>
                  <FormControlLabel
                    label="Oferta"
                    labelPlacement="start"
                    control={
                      <Switch
                        onChange={(e) =>
                          setValue("inOffer", e.target.checked, {
                            shouldValidate: true,
                          })
                        }
                        checked={getValues("inOffer")}
                      />
                    }
                  />
                </FormControl>
              </Grid>
              {getValues("inOffer") && (
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      label="Precio oferta"
                      type="number"
                      variant="filled"
                      fullWidth
                      sx={{ minWidth: "100%" }}
                      {...register("offerPrice", {
                        required: "Favor ingresar valor oferta",
                      })}
                      error={!!errors.offerPrice}
                      helperText={errors.offerPrice?.message}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Divider sx={{ my: 2, display: { xs: "flex", sm: "none" } }} />
          </Grid>
          {/* contenido */}
          <Grid item container xs={12} sm={6}>
            <Grid item xs={12}>
              <TextField
                label="Contenido"
                variant="filled"
                fullWidth
                sx={{ mb: 1 }}
                helperText="Presiona [.] para agregar"
                onKeyDown={onAddItems}
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  listStyle: "none",
                  p: 0,
                  m: 0,
                  mb: 3,
                }}
                component="ul"
              >
                {getValues("promotionItems").map((item) => {
                  return (
                    <Chip
                      key={item}
                      label={item}
                      onDelete={() => onDeleteTag(item)}
                      color="primary"
                      size="small"
                      sx={{ ml: 1, mt: 1 }}
                    />
                  );
                })}
              </Box>
            </Grid>

            {/* imagenes */}
            <Grid item container spacing={2} xs={12}>
              {getValues("images").map((img) => (
                <Grid className="fadeIn" item xs={6} md={4} lg={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      className="fadeIn"
                      image={img.toString()}
                      sx={{ objectFit: "cover", height: "150px" }}
                      alt={"Imagen producto"}
                    />
                    <CardActions>
                      <Button
                        className="fadeIn"
                        onClick={() => onDeleteImage(img)}
                        fullWidth
                        color="error"
                      >
                        Borrar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  startIcon={<UploadOutlined />}
                  fullWidth
                  sx={{ mb: 3 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Cargar otra imagen
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png, image/gif, image/jpeg"
                  style={{ display: "none" }}
                  onChange={onFilesSelected}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = "" } = query;

  const promotion = await dbPromotions.getPromotionById(id.toString());
  const categories = await dbCategories.getCategories();

  if (!promotion) {
    return {
      redirect: {
        destination: `/admin/promotions`,
        permanent: false,
      },
    };
  }
  return {
    props: { promotion, categories },
  };
};

export default OrderInfoPage;
