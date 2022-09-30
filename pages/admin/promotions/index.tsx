import {
  AddOutlined,
  CategoryOutlined,
  Delete,
  TextFields,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Link,
  Switch,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import React, { useState } from "react";
import { AdminLayout } from "../../../components/layouts";
import { InputImportanceTable } from "../../../components/promotions";
import { FullScreenLoading } from "../../../components/ui";
import { useDeletePromotion } from "../../../hooks";
import { IPromotion } from "../../../interfaces";

import { useUpdateProductByPropertyMutation } from "../../../store/RTKQuery/productsApi";
import { useGetAllPromotionsQuery } from "../../../store/RTKQuery/promotionApi";
import { currency } from "../../../utils";

const dictType = {
  filling: "Relleno",
  envelope: "Envoltura",
  sauce: "Salsa",
  other: "Otros",
};

const ProductsPage = () => {
  const { data: dataPromotions } = useGetAllPromotionsQuery(null);
  const [updateProduct] = useUpdateProductByPropertyMutation();
  const { onDeletePromotion, deletePromotionStatus } = useDeletePromotion();
  const [numberImportance, setNumberImportance] = useState(0);

  const columns: GridColDef[] = [
    {
      field: "img",
      flex: 1,
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
      flex: 1,
      headerName: "Nombre",
      minWidth: 200,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <NextLink href={`/admin/promotions/${row.id}`} passHref>
            <Link underline="always">{row.name}</Link>
          </NextLink>
        );
      },
    },
    { field: "type", headerName: "Categoría", flex: 1, minWidth: 100 },
    // {
    //   field: "importanceNumber",
    //   headerName: "N°",
    //   flex: 1,
    //   minWidth: 65,
    //   renderCell: ({ row }: GridValueGetterParams) => (
    //     <InputImportanceTable num={row.importanceNumber} id={row.id} />
    //   ),
    // },
    {
      field: "inStock",
      flex: 1,
      headerName: "Stock",
      minWidth: 80,
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
      flex: 1,
      headerName: "Precio",
      minWidth: 80,

      renderCell: ({ row }: GridValueGetterParams) => {
        return currency.format(row.price);
      },
    },
    {
      field: "delete",
      flex: 1,
      headerName: "Eliminar",
      width: 70,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton
            disabled={deletePromotionStatus.isLoading}
            onClick={() =>
              onDeletePromotion({ id: row.id, img: row.img, name: row.name })
            }
            color="error"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        );
      },
    },
  ];

  if (!dataPromotions) return <FullScreenLoading />;

  const rows = dataPromotions!.map((product: IPromotion) => ({
    id: product._id,
    name: product.name,
    img: product.images[0],
    type: product.category.name,
    inStock: product.inStock,
    price: product.price,
    importanceNumber: product?.importanceNumber,
  }));
  console.log({ rows });

  return (
    <AdminLayout
      icon={<CategoryOutlined />}
      title={`Promociones (${dataPromotions?.length})`}
      subTitle={"Mantenimiento de promociones"}
    >
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/promotions/new"
        >
          Crear promocion
        </Button>
      </Box>
      <Grid className="fadeIn" container xs={12} height={650} width="100%">
        <DataGrid
          disableSelectionOnClick={true}
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
