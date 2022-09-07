import { ConfirmationNumberOutlined, PeopleOutline } from "@mui/icons-material";
import { Chip, Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { FullScreenLoading } from "../../components/ui";
import { IOrder, IUser } from "../../interfaces";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../store/RTKQuery/adminApi";
import { useGetAllOrdersQuery } from "../../store/RTKQuery/ordersApi";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 250 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "name", headerName: "Nombre Completo", width: 300 },
  { field: "total", headerName: "Monto total", width: 300 },
  {
    field: "isPaid",
    headerName: "Pagada",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  {
    field: "noProducts",
    headerName: "No.Productos",
    align: "center",
    width: 150,
  },
  {
    field: "check",
    headerName: "Ver orden",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "Creada en", width: 300 },
];

const OrdersPage = () => {
  const { data: dataOrders } = useGetAllOrdersQuery(null);

  console.log(dataOrders);
  if (!dataOrders) return <FullScreenLoading />;

  const rows = dataOrders!.map((order: IOrder) => ({
    id: order?._id,
    email: (order?.user as IUser).email!,
    name: (order?.user as IUser).name!,
    total: order?.total,
    isPaid: order?.isPaid,
    noProducts: order?.numberOfItems,
    createdAt: order?.createdAt,
  }));

  return (
    <AdminLayout
      icon={<ConfirmationNumberOutlined />}
      title={"Ordenes"}
      subTitle={"Mantenimiento de ordenes"}
    >
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

export default OrdersPage;
