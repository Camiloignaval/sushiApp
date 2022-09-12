import { ConfirmationNumberOutlined, PeopleOutline } from "@mui/icons-material";
import { Chip, Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { FullScreenLoading } from "../../components/ui";
import { IOrder, IUser } from "../../interfaces";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../store/RTKQuery/adminApi";
import { useGetAllOrdersQuery } from "../../store/RTKQuery/ordersApi";
import { currency } from "../../utils";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 150 },
  { field: "name", headerName: "Nombre", width: 150 },
  { field: "phone", headerName: "Teléfono", width: 150 },
  { field: "address", headerName: "Dirección", width: 250 },
  {
    field: "total",
    headerName: "Monto total",
    width: 100,
    renderCell: ({ row }: GridValueGetterParams) => {
      return currency.format(row.total);
    },
  },
  {
    field: "status",
    headerName: "Estado",
    width: 120,
    renderCell: ({ row }: GridValueGetterParams) => {
      if (row.status === "ingested") {
        return (
          <Chip
            variant="outlined"
            label="Ingresada"
            color="primary"
            sx={{ width: "100%" }}
          />
        );
      }
      if (row.status === "inprocess") {
        return (
          <Chip
            variant="outlined"
            label="En proceso"
            color="warning"
            sx={{ width: "100%" }}
          />
        );
      }
      if (row.status === "dispatched") {
        return (
          <Chip
            variant="outlined"
            label="Despachada"
            color="secondary"
            sx={{ width: "100%" }}
          />
        );
      }
      if (row.status === "delivered") {
        return (
          <Chip
            variant="outlined"
            label="Entregada"
            color="success"
            sx={{ width: "100%" }}
          />
        );
      }
    },
  },
  {
    field: "noProducts",
    headerName: "No.Productos",
    align: "center",
    width: 100,
  },
  {
    field: "extras",
    headerName: "Extras",
    align: "center",
    width: 60,
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
  { field: "createdAt", headerName: "Ingresada en", width: 300 },
];

const OrdersPage = () => {
  const { data: dataOrders } = useGetAllOrdersQuery(null);

  console.log(dataOrders);
  if (!dataOrders) return <FullScreenLoading />;

  const rows = dataOrders!.map((order: IOrder) => ({
    id: order?._id?.slice(-10),
    name: order.shippingAddress.username!,
    total: order?.total,
    address: `${order.shippingAddress.address} ${order.shippingAddress.commune}`,
    status: order?.status,
    phone: order.shippingAddress.phone,
    noProducts: order?.numberOfItems,
    createdAt: format(new Date(order?.createdAt!), "dd-mm-yyyy hh:mm:ss"),
    extras: order?.orderExtraItems?.length,
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
