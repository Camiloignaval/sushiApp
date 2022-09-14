import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link, Switch } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../../components/layouts";
import { FullScreenLoading } from "../../../components/ui";
import { IProduct } from "../../../interfaces";

import {
  useGetProductsQuery,
  useUpdateProductByPropertyMutation,
} from "../../../store/RTKQuery/productsApi";
import { currency } from "../../../utils";

const dictType = {
  filling: "Relleno",
  envelope: "Envoltura",
  sauce: "Salsa",
  other: "Otros",
};

const ProductsPage = () => {
  const { data: dataProducts } = useGetProductsQuery(null);
  console.log({ dataProducts });
  const [updateProduct] = useUpdateProductByPropertyMutation();
  const columns: GridColDef[] = [
    {
      field: "img",
      headerName: "Foto",
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <CardMedia
            alt={row.title}
            component={"img"}
            className="fadeIn"
            image={row.img}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Nombre",
      width: 150,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <NextLink href={`/admin/products/${row.id}`} passHref>
            <Link underline="always">{row.name}</Link>
          </NextLink>
        );
      },
    },
    { field: "type", headerName: "Tipo" },
    {
      field: "inStock",
      headerName: "Stock",
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Switch
            checked={row.inStock}
            onClick={({ target }) =>
              updateProduct({
                id: row.id,
                category: "inStock",
                value: (target as HTMLInputElement).checked,
              })
            }
          />
        );
      },
    },
    {
      field: "price",
      headerName: "Precio",
      renderCell: ({ row }: GridValueGetterParams) => {
        return currency.format(row.price);
      },
    },
  ];

  if (!dataProducts) return <FullScreenLoading />;

  const rows = dataProducts!.map((product: IProduct) => ({
    id: product._id,
    name: product.name,
    img: product.image,
    type: dictType[product.type],
    inStock: product.inStock,
    price: product.price,
  }));

  return (
    <AdminLayout
      icon={<CategoryOutlined />}
      title={`Productos (${dataProducts?.length})`}
      subTitle={"Mantenimiento de productos"}
    >
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear producto
        </Button>
      </Box>
      <Grid className="fadeIn" container xs={12} height={650} width="100%">
        <DataGrid
          rows={rows ?? []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
        ></DataGrid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
