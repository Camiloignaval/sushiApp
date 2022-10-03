import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";

const link = "https://api.cloudinary.com/v1_1/dc6vako2z/image/upload";

import { AdminLayout, ShopLayout } from "../../../components/layouts";
import { dbCategories, dbProducts, dbPromotions } from "../../../database";
import { ICategory, IProduct, IPromotion } from "../../../interfaces";
import { Controller, useForm } from "react-hook-form";
import { Delete, SaveOutlined, UploadOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

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
  Typography,
  InputLabel,
  IconButton,
  Autocomplete,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import { useUpdatePromotionMutation } from "../../../store/RTKQuery/promotionApi";
import { useDeletePromotion } from "../../../hooks";

interface Props {
  promotion: IPromotion;
  categories: ICategory[];
  sauces: IProduct[];
}

const units = ["Piezas", "Porciones", "Rolls"];

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
  includesSauces: IProduct[];
  qtySauces: number;
  _id?: string;
}

const PromotionInfoPage: FC<Props> = ({ promotion, categories, sauces }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newItemValue, setNewItemValue] = useState("");
  const { onDeletePromotion, deletePromotionStatus } = useDeletePromotion();

  const [updatePromotion, updatePromotionState] = useUpdatePromotionMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm<FormData>({
    defaultValues: promotion,
  });

  // console.log({ sauces });
  // useEffect(() => {
  //   const salsasInBdd = sauces.filter((s) =>
  //     ["632de03363d307a2565621e2", "63365fe640807a37067429ff"].includes(s._id!)
  //   );
  //   console.log({ salsasInBdd });
  //   setValue("includesSauces", salsasInBdd as any, { shouldValidate: true });
  // }, []);

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
    // TODO BORRAR DE CLOUDINARY
    setValue(
      "images",
      getValues("images").filter((i) => i !== img),
      { shouldValidate: true }
    );
  };

  const onAddItems = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.code !== "Slash") return;
    if (newItemValue === "") return;
    if (getValues("promotionItems").includes(newItemValue.trim())) return;
    if (getValues("promotionItems")) {
      setValue(
        "promotionItems",
        [...getValues("promotionItems"), newItemValue.trim().replace("-", "")],
        {
          shouldValidate: true,
        }
      );
    } else {
      setValue("promotionItems", [newItemValue.trim()], {
        shouldValidate: true,
      });
    }
    setNewItemValue("");
    return;
  };

  const onDeleteTag = (tag: string) => {
    setValue(
      "promotionItems",
      getValues("promotionItems").filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  useEffect(() => {}, [getValues("promotionItems")]);

  const onSubmit = (formData: FormData) => {
    console.log({ formData });
    if (getValues("inOffer")) {
      if (getValues("offerPrice")! > getValues("price")) {
        toast.error("El valor oferta es mayor al actual, favor verifique");
        return;
      }
    }
    updatePromotion(formData)
      .unwrap()
      .then(() => {
        router.replace("/admin/promotions");
      });
    return true;
  };
  return (
    <AdminLayout
      icon={<EditIcon />}
      title={`Editar ${promotion.name}`}
      subTitle={"Mantenimiento de promociones"}
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
              <InputLabel id="demo-simple-select-label">Categoría </InputLabel>
              <Select
                {...register("category", { required: "Unidad es requerida" })}
                label="Categoría"
                value={getValues("category")}
                onChange={({ target: { value } }) =>
                  setValue("category", value as any, { shouldValidate: true })
                }
              >
                {categories.map((cat: ICategory, i) => (
                  <MenuItem key={i} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField
                    label="Cantidad"
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
                  <InputLabel id="demo-simple-select-label">Unidad </InputLabel>

                  <Select
                    {...register("unit", { required: "Unidad es requerida" })}
                    value={getValues("unit")}
                    label="Unidad"
                    onChange={({ target: { value } }) =>
                      setValue("unit", value as any, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {units.map((unit, i) => (
                      <MenuItem key={i} value={unit}>
                        {unit}
                      </MenuItem>
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
            <Grid xs item container mt={2}>
              <Grid mb={2} xs={12} lg={3}>
                <FormControl fullWidth sx={{ pr: { xs: 0, lg: 2 } }}>
                  <TextField
                    label="Salsas incluidas"
                    type="number"
                    variant="filled"
                    fullWidth
                    sx={{ minWidth: "100%" }}
                    {...register("qtySauces", {
                      required: "Ingresar cantidad",
                    })}
                    error={!!errors.qtySauces}
                    helperText={errors.qtySauces?.message}
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} lg={9}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    {...register("includesSauces", {
                      required: "Unidad es requerida",
                    })}
                    multiple
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value, i) => {
                          console.log({ value });
                          return (
                            <Chip
                              key={i}
                              label={
                                sauces.find(
                                  (s) => (s!._id as any) === (value as any)
                                )?.name
                              }
                            />
                          );
                        })}
                      </Box>
                    )}
                    label="Salsas seleccionables"
                    value={getValues("includesSauces") ?? []}
                    onChange={({ target: { value } }) =>
                      setValue("includesSauces", value as any, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {sauces.map((s) => (
                      <MenuItem value={s._id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
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
                helperText="Presiona [-] para agregar"
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
              {getValues("images").map((img, i) => (
                <Grid className="fadeIn" key={i} item xs={6} md={4} lg={3}>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Box sx={{ position: "absolute", right: 50, bottom: 50 }}>
        <IconButton
          disabled={deletePromotionStatus.isLoading}
          onClick={() =>
            onDeletePromotion({
              id: promotion._id!,
              img: promotion.images[0],
              name: promotion.name,
            })
          }
          color="error"
          aria-label="delete"
        >
          <Delete sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = "" } = query;

  const promotion = await dbPromotions.getPromotionById(id.toString());
  const categories = await dbCategories.getCategories();
  const sauces = await dbProducts.getSauces();

  if (!promotion) {
    return {
      redirect: {
        destination: `/admin/promotions`,
        permanent: false,
      },
    };
  }
  return {
    props: { promotion, categories, sauces },
  };
};

export default PromotionInfoPage;
