import {
  AddOutlined,
  CategoryOutlined,
  Delete,
  LocalOfferOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Link,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import React, { FC } from "react";
import { AdminLayout } from "../../../components/layouts";
import { FullScreenLoading } from "../../../components/ui";
import { useDeleteProduct } from "../../../hooks";
import { ICoupon, IProduct } from "../../../interfaces";
import { GetServerSideProps } from "next";

import {
  useGetProductsQuery,
  useUpdateProductByPropertyMutation,
} from "../../../store/RTKQuery/productsApi";
import { currency } from "../../../utils";
import { dbCoupons } from "../../../database";
import { format, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  cupones: ICoupon[];
}

const ProductsPage: FC<Props> = ({ cupones }) => {
  const { data: dataProducts } = useGetProductsQuery(null);
  const { onDeleteProduct, deleteProductStatus } = useDeleteProduct();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      width: 150,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <NextLink href={`/admin/coupons/${row.id}`} passHref>
            <Link underline="always">{row.name}</Link>
          </NextLink>
        );
      },
    },
    {
      field: "code",
      headerName: "Código",
      width: 120,
    },
    {
      field: "startIn",
      headerName: "Fecha inicio",
      width: 280,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row?.startIn ? (
          <Typography>
            {format(new Date(row?.startIn), "dd MMMM yyyy, hh:mm a", {
              locale: es,
            })}
          </Typography>
        ) : (
          ""
        );
      },
    },
    {
      field: "expireIn",
      headerName: "Fecha expiración",
      width: 280,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row?.expireIn ? (
          <Typography>
            {format(new Date(row?.expireIn), "dd MMMM yyyy, hh:mm a", {
              locale: es,
            })}
          </Typography>
        ) : (
          ""
        );
      },
    },
    {
      field: "Expirado",
      width: 150,
      headerName: "Estado",
      renderCell: ({ row }: GridValueGetterParams) => {
        if (row.qtyUsed >= row.qtyAvailable) {
          return (
            <Chip
              sx={{ width: "100%" }}
              label="Agotados"
              variant="outlined"
              color="error"
            />
          );
        }
        if (
          row.expire &&
          isBefore(new Date(row.startIn), new Date(row?.expireIn))
        ) {
          return (
            <Chip
              sx={{ width: "100%" }}
              label="Expirado"
              variant="outlined"
              color="error"
            />
          );
        }
        if (!isBefore(new Date(row.startIn), new Date(row?.expireIn))) {
          <Chip
            sx={{ width: "100%" }}
            label="Vigente"
            variant="outlined"
            color="success"
          />;
        }
      },
    },
    {
      field: "Ocupados",
      headerName: "Ocupados",
      width: 100,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.qtyUsed < row.qtyAvailable ? (
          <Chip
            sx={{ width: "100%" }}
            label={`${row.qtyUsed}/${row.qtyAvailable}`}
            variant="outlined"
            color="default"
          />
        ) : (
          <Chip
            sx={{ width: "100%" }}
            label={`${row.qtyUsed}/${row.qtyAvailable}`}
            variant="outlined"
            color="success"
          />
        );
      },
    },
    {
      field: "discount",
      headerName: "Descuento",
      width: 100,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row?.type === "percentage"
          ? `${row.discount}%`
          : currency.format(row?.minPurchase);
      },
    },
    {
      field: "minPurchase",
      headerName: "Mín. Compra",
      width: 100,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row?.minPurchase ? currency.format(row?.minPurchase) : "";
      },
    },
    {
      field: "maxDiscount",
      headerName: "Max. Desc.",
      width: 100,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row?.maxDiscount ? currency.format(row?.maxDiscount) : "";
      },
    },
    {
      field: "delete",
      headerName: "Eliminar",
      width: 70,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton
            disabled={deleteProductStatus.isLoading}
            onClick={() => onDeleteProduct(row)}
            color="error"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        );
      },
    },
  ];

  if (!dataProducts) return <FullScreenLoading />;

  // const rows = cupones!.map((cupon: ICoupon) => ({
  //   id: cupon._id,
  //   initDate: cupon.createdAt,
  //   endDate: cupon?.expireIn,
  //   code: cupon.code,
  //   discount: cupon.discount,
  //   minPurchase: cupon?.minPurchase,
  //   name: cupon.name,
  //   qtyAvailable: cupon.qtyAvailable,
  //   qtyUsed: cupon.qtyUsed,
  //   type: cupon.type,
  // }));

  return (
    <AdminLayout
      icon={<LocalOfferOutlined />}
      title={`Cupones (${dataProducts?.length})`}
      subTitle={"Mantenimiento de cupones"}
    >
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/coupons/new"
        >
          Nuevo cupón
        </Button>
      </Box>
      <Grid className="fadeIn" container xs={12} height={650} width="100%">
        <DataGrid
          disableSelectionOnClick={true}
          rows={cupones ?? []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
        ></DataGrid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cuponeswithOutId = await dbCoupons.getAllCoupons();
  const cupones = cuponeswithOutId.map((c) => ({ ...c, id: c._id }));
  return {
    props: {
      cupones,
    },
  };
};

export default ProductsPage;
