import {
  AddOutlined,
  CategoryOutlined,
  Delete,
  DoneAllOutlined,
} from "@mui/icons-material";
import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "../../../components/layouts";
import { FullScreenLoading } from "../../../components/ui";
import { useDeleteProduct } from "../../../hooks";
import { useDeleteCategory } from "../../../hooks/useDeleteCategory";
import { ICategory } from "../../../interfaces";
import {
  useChangeNameCategoryMutation,
  useGetCategoriesQuery,
  useNewCategoryMutation,
} from "../../../store/RTKQuery/categoriesApi";

const CategoriesPage = () => {
  const [showInputNewCategory, setshowInputNewCategory] = useState(false);
  const [valueNewCategory, setValueNewCategory] = useState("");
  const [updateName, updateNameStatus] = useChangeNameCategoryMutation();
  const [newCategory, newCategoryStatus] = useNewCategoryMutation();
  const { data: categories } = useGetCategoriesQuery();
  const { onDeleteCategory, deleteCategoryStatus } = useDeleteCategory();

  const columns: GridColDef[] = [
    {
      field: "id",
      flex: 1,
      headerName: "Id",
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.id.slice(-10);
      },
    },
    {
      field: "name",
      flex: 1,
      headerName: "Nombre",
      width: 150,
      editable: updateNameStatus.isLoading,
    },

    {
      field: "delete",
      flex: 1,
      headerName: "Eliminar",
      width: 70,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton
            disabled={deleteCategoryStatus.isLoading}
            onClick={() => onDeleteCategory(row)}
            color="error"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        );
      },
    },
  ];

  const rows = useMemo(
    () =>
      (categories ?? [])!.map((categories: ICategory) => ({
        id: categories._id,
        name: categories.name,
      })),
    [categories]
  );

  const onSaveCategory = async () => {
    try {
      await newCategory(valueNewCategory).unwrap();
      setshowInputNewCategory(false);
      setValueNewCategory("");
    } catch (error) {
      console.log({ error });
    }
  };

  if (!categories) return <FullScreenLoading />;

  return (
    <AdminLayout
      icon={<CategoryOutlined />}
      title={`Categorías (${categories?.length})`}
      subTitle={"Mantenimiento de categorías"}
    >
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        {showInputNewCategory ? (
          <Box>
            <TextField
              label="Nueva categoría"
              variant="standard"
              color="primary"
              value={valueNewCategory}
              onChange={(e) => setValueNewCategory(e.target.value)}
              //   focused
            />
            <IconButton
              disabled={valueNewCategory === "" || newCategoryStatus.isLoading}
              sx={{ display: "relative", top: 5 }}
              aria-label="delete"
              size="large"
              onClick={onSaveCategory}
            >
              <DoneAllOutlined
                color={
                  valueNewCategory === "" || newCategoryStatus.isLoading
                    ? "inherit"
                    : "success"
                }
                fontSize="inherit"
              />
            </IconButton>
          </Box>
        ) : (
          <Button
            startIcon={<AddOutlined />}
            color="secondary"
            onClick={() => setshowInputNewCategory(true)}
            //   href="/admin/categories/new"
          >
            Nueva categoría
          </Button>
        )}
      </Box>
      <Grid className="fadeIn" container xs={12} height={650} width="100%">
        <DataGrid
          onCellEditCommit={(
            params: GridCellEditCommitParams // arreglar  GridCellEditCommitParams,
          ) => {
            if (categories.find((c) => c._id)?.name !== params.value) {
              console.log({ paramsDesdeCommmit: params });
              updateName({ id: params.id, name: params.value });
            }
          }}
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

export default CategoriesPage;
