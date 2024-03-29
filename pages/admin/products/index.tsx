import { AddOutlined, CategoryOutlined, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Link,
  Switch,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import React, { useState } from "react";
import { AdminLayout } from "../../../components/layouts";
import { FullScreenLoading } from "../../../components/ui";
import { useDeleteProduct } from "../../../hooks";
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
  const [updateProduct] = useUpdateProductByPropertyMutation();
  const { onDeleteProduct, deleteProductStatus } = useDeleteProduct();
  const [pageSize, setPageSize] = useState(10);
  const columns: GridColDef[] = [
    {
      field: "img",
      headerName: "Foto",
      flex: 1,
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
      flex: 1,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <NextLink href={`/admin/products/${row.id}`} passHref>
            <Link underline="always">{row.name}</Link>
          </NextLink>
        );
      },
    },
    { field: "type", headerName: "Tipo", flex: 1 },
    {
      field: "inStock",
      headerName: "Stock",
      flex: 1,
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
      flex: 1,
      renderCell: ({ row }: GridValueGetterParams) => {
        return currency.format(row.price);
      },
    },
    {
      field: "delete",
      headerName: "Eliminar",
      width: 70,
      flex: 1,
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

  const rows = dataProducts!.map((product: IProduct) => ({
    id: product._id,
    name: product.name,
    img: product.image,
    type: dictType[product.type!],
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
          disableSelectionOnClick={true}
          rows={rows ?? []}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 30]}
          onPageSizeChange={(value) => setPageSize(value)}
        ></DataGrid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
