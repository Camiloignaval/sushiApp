import { DeliveryDiningOutlined, DoneAll } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material";
import {
  GridRowId,
  GridColDef,
  GridValueGetterParams,
  DataGrid,
  esES,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { FullScreenLoading } from "../../components/ui";
import { IOrder } from "../../interfaces";
import {
  useChangeOrderStatusMutation,
  useGetAllOrdersQuery,
} from "../../store/RTKQuery/ordersApi";

const DeliverPage = () => {
  const [changeStatus, changeStatusState] = useChangeOrderStatusMutation();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const { data: dataOrders, isLoading } = useGetAllOrdersQuery(
    `status=dispatched&page=${page + 1}&limit=${pageSize}`
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Orden ID",
      minWidth: 90,
      flex: 1,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.id.slice(-10);
      },
    },
    { field: "address", headerName: "Dirección", minWidth: 150, flex: 1 },
    {
      field: "deliver",
      flex: 1,
      headerName: "Entrega",
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton
            onClick={() =>
              changeStatus({ ids: [row.id], newStatus: "delivered" })
            }
            color="success"
            disabled={changeStatusState.isLoading}
          >
            <DoneAll />
          </IconButton>
        );
      },
    },
  ];
  const [rowCountState, setRowCountState] = React.useState(
    dataOrders?.totalDocs || 0
  );
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      dataOrders?.totalDocs !== undefined
        ? dataOrders?.totalDocs
        : prevRowCountState
    );
  }, [dataOrders?.totalDocs, setRowCountState]);

  if (!dataOrders) return <FullScreenLoading />;

  const rows = dataOrders!.docs.map((order: IOrder) => ({
    id: order?._id,
    address: `${order.shippingAddress.address.split(",", 1)}`,
  }));
  return (
    <AdminLayout
      icon={
        <DeliveryDiningOutlined
          sx={{
            fontSize: "2rem",
            position: "relative",
            top: 5,
          }}
        />
      }
      title={"Ordenes en camino"}
    >
      <Grid
        className="fadeIn"
        container
        xs={12}
        mt={2}
        height={"calc(100vh - 170px)"}
        width="100%"
      >
        <DataGrid
          rowCount={rowCountState}
          loading={isLoading}
          rowsPerPageOptions={[10, 20, 30, 50, 70, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          disableSelectionOnClick
          rows={rows ?? []}
          columns={columns}
          componentsProps={{
            pagination: { classes: null },
          }}
        ></DataGrid>
      </Grid>
    </AdminLayout>
  );
};

export default DeliverPage;
