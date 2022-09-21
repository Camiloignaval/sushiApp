import React, { FC, useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import { AdminLayout } from "../../../components/layouts";
import { dbCoupons } from "../../../database";
import { ICoupon, ITypeCoupon } from "../../../interfaces";
import { useForm } from "react-hook-form";
import { Delete, SaveOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  TextField,
  Divider,
  FormControl,
  FormControlLabel,
  Button,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useUpdateProductMutation } from "../../../store/RTKQuery/productsApi";
import toast from "react-hot-toast";
import { useUploadFilesMutation } from "../../../store/RTKQuery/uploadApi";
import axios from "axios";
import { useRouter } from "next/router";
import { TextareaAutosize } from "@mui/base";
import { useUpdatePromotionMutation } from "../../../store/RTKQuery/promotionApi";
import { useDeletePromotion } from "../../../hooks";
import product from "../../api/admin/product";
import { Schema } from "mongoose";
import { DateTimePicker } from "@mui/lab";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { useUpdateCouponMutation } from "../../../store/RTKQuery/couponApi";

interface Props {
  cupon: ICoupon | any;
}

interface FormData {
  _id?: string;
  name: string;
  code: string;
  startIn: string;
  expire: boolean;
  expireIn?: string;
  qtyAvailable: number;
  type: ITypeCoupon;
  discount: number;
  maxDiscount?: number;
  minPurchase?: number;
}

const PromotionInfoPage: FC<Props> = ({ cupon }) => {
  const router = useRouter();

  const [activeMaxDiscount, setActiveMaxDiscount] = useState(
    !!cupon.maxDiscount
  );
  const [activeMinPurchase, setActiveMinPurchase] = useState(
    !!cupon.minPurchase
  );
  //   const { onDeletePromotion, deletePromotionStatus } = useDeletePromotion();
  const [updateCoupon, updateCouponState] = useUpdateCouponMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm<FormData>({
    defaultValues: cupon,
  });

  useEffect(() => {
    if (!activeMaxDiscount) {
      setValue("maxDiscount", undefined, { shouldValidate: true });
    }
  }, [activeMaxDiscount]);

  useEffect(() => {
    if (!activeMinPurchase) {
      setValue("minPurchase", undefined, { shouldValidate: true });
    }
  }, [activeMinPurchase]);

  const onSubmit = async (formData: FormData) => {
    console.log("llegue a submit");
    formData.startIn = new Date(formData.startIn).toISOString();
    // eliminar expireIn
    if (!formData.expire && formData?.expireIn) {
      delete formData.expireIn;
    } else {
      formData.expireIn = formData.expireIn
        ? new Date(formData.expireIn).toISOString()
        : undefined;
    }
    formData.code = formData.code.toUpperCase();
    updateCoupon(formData)
      .unwrap()
      .then(() => {
        router.push("/admin/coupons");
      });
    return true;
  };

  return (
    <AdminLayout
      icon={<EditIcon />}
      title={`Editar ${cupon.name}`}
      subTitle={"Mantenimiento de cupones"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            disabled={updateCouponState.isLoading}
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
          >
            Guardar
          </Button>
        </Box>

        <Grid mt={2} container spacing={3}>
          {/* Data */}
          <Grid item xs={12} sm={5.5}>
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
              label="Código"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("code", {
                required: "Este campo es requerido",
                minLength: { value: 4, message: "Mínimo 4 caracteres" },
                maxLength: { value: 10, message: "Máximo 10 caracteres" },
              })}
              error={!!errors.code}
              helperText={errors.code?.message}
            />
            <TextField
              label="Cantidad cupones"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("qtyAvailable", {
                required: "Este campo es requerido",
                minLength: { value: 0, message: "Mínimo de valor 0" },
              })}
              error={!!errors.qtyAvailable}
              helperText={errors.qtyAvailable?.message}
            />
            <Divider sx={{ my: 2 }} />

            <Grid container rowGap={1}>
              <Grid
                item
                xs={getValues("expire") ? 12 : 8}
                md={getValues("expire") ? 5 : 10}
              >
                {" "}
                <TextField
                  id="datetime-local"
                  label="Fecha inicio"
                  type="datetime-local"
                  sx={{ width: "100%" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("startIn", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.startIn}
                  helperText={errors.startIn?.message}
                />
              </Grid>
              <Grid item xs={4} md={2} display="flex" justifyContent={"center"}>
                <FormControl>
                  <FormControlLabel
                    label="Expira"
                    labelPlacement="top"
                    control={
                      <Switch
                        onChange={(e) =>
                          setValue("expire", e.target.checked, {
                            shouldValidate: true,
                          })
                        }
                        // checked={getValues("inStock")}
                      />
                    }
                  />
                </FormControl>
              </Grid>
              {getValues("expire") && (
                <Grid item xs={8} md={5}>
                  {" "}
                  <TextField
                    id="datetime-local"
                    label="Fecha término"
                    type="datetime-local"
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("expireIn", {
                      required: "Este campo es requerido",
                    })}
                    error={!!errors.expireIn}
                    helperText={errors.expireIn?.message}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          {/* <Grid item xs={1} sm={4}> */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              ml: 3,
              width: "1px",
              display: "flex",
              justifyContent: "end",
            }}
          />
          {/* </Grid> */}

          {/* segunda columna en tamaño grande */}
          <Grid item xs={12} sm={5.5}>
            {/* tipo de descuento */}
            <Grid container>
              <Grid item xs={12} md={6} sx={{ mb: 1, pr: { xs: 0, md: 1 } }}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    {...register("type", { required: "Unidad es requerida" })}
                    label="Categoría"
                    value={getValues("type")}
                    onChange={({ target: { value } }) =>
                      setValue("type", value as any, { shouldValidate: true })
                    }
                  >
                    <MenuItem value={"money"}>Dinero</MenuItem>
                    <MenuItem value={"percentage"}>Porcentaje</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} mb={1}>
                {/* cantidad descuento */}
                <TextField
                  fullWidth
                  variant="filled"
                  type={"number"}
                  label="Descuento"
                  {...register("discount", {
                    required: "Descuento es requerido",
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        {getValues("type") === "percentage" ? "%" : "CLP"}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            {/* maxDescuento */}
            <Grid container mb={1} xs={12}>
              <Grid item xs={7} md={6} pr={1}>
                <FormControl>
                  <FormControlLabel
                    label="Máximo descuento"
                    labelPlacement="start"
                    control={
                      <Switch
                        checked={activeMaxDiscount}
                        onChange={(e) => setActiveMaxDiscount((prev) => !prev)}
                      />
                    }
                  />
                </FormControl>
              </Grid>
              <Grid container xs={5} md={6}>
                <TextField
                  fullWidth
                  disabled={!activeMaxDiscount}
                  variant="filled"
                  type={"number"}
                  // label="Descuento"
                  {...register("maxDiscount", {
                    required: activeMaxDiscount
                      ? "Máximo descuento es requerido"
                      : false,
                  })}
                  error={!!errors.maxDiscount}
                  helperText={errors.maxDiscount?.message}
                />
              </Grid>
            </Grid>
            {/* Minimo compra */}
            <Grid container xs={12}>
              <Grid item xs={7} md={6} pr={1}>
                <FormControl>
                  <FormControlLabel
                    label="Minimo de compra"
                    labelPlacement="start"
                    control={
                      <Switch
                        checked={activeMinPurchase}
                        sx={{ marginLeft: 0.5 }}
                        onChange={(e) => setActiveMinPurchase((prev) => !prev)}
                        // checked={getValues("inStock")}
                      />
                    }
                  />
                </FormControl>
              </Grid>
              <Grid container xs={5} md={6}>
                <TextField
                  disabled={!activeMinPurchase}
                  fullWidth
                  variant="filled"
                  // label="Descuento"
                  type={"number"}
                  {...register("minPurchase", {
                    required: activeMinPurchase
                      ? "Minimo de compra es requerido"
                      : false,
                  })}
                  error={!!errors.minPurchase}
                  helperText={errors.minPurchase?.message}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Box sx={{ position: "absolute", right: 50, bottom: 50 }}>
        <IconButton
          //   disabled={deletePromotionStatus.isLoading}
          //   onClick={() =>
          //     onDeletePromotion({
          //       id: promotion._id!,
          //       img: promotion.images[0],
          //       name: promotion.name,
          //     })
          //   }
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
  const cupon = await dbCoupons.getCouponById(id.toString());

  if (!cupon) {
    return {
      redirect: {
        destination: `/admin/coupons`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      cupon: {
        ...cupon,
        startIn: cupon.startIn.slice(0, 16),
        expireIn: cupon?.expire ? cupon?.expireIn!.slice(0, 16) : null,
      },
    },
  };
};

export default PromotionInfoPage;
