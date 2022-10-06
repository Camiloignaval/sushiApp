import {
  ConfirmationNumberOutlined,
  DoneAllOutlined,
  MessageOutlined,
  ReplayOutlined,
} from "@mui/icons-material";
import { Box, Chip, Grid, IconButton } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueGetterParams,
  esES,
  GridToolbar,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../../components/layouts";
import { MessageModal, OrdersActions } from "../../../components/orders";
import { FullScreenLoading } from "../../../components/ui";
import { IOrder } from "../../../interfaces";
import {
  useGetAllOrdersQuery,
  useRetryConfirmOrderMutation,
} from "../../../store/RTKQuery/ordersApi";
import { currency } from "../../../utils";
import { printOrder } from "../../../utils/printOrder";

const OrdersPage = () => {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [retryConfirmQuery, retryConfirmStatus] =
    useRetryConfirmOrderMutation();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [open, setOpen] = useState(false);
  const [statusQuery, setStatusQuery] = useState<string | undefined>(undefined);
  const [userActiveToWsp, setuserActiveToWsp] = useState({
    phone: "",
    name: "",
  });

  const { data: dataOrders, isLoading } = useGetAllOrdersQuery(
    `page=${page + 1}&limit=${pageSize}${
      statusQuery && `&status=${statusQuery}`
    }`,
    {
      pollingInterval: 60000, // 1 minuto,
    }
  );

  useEffect(() => {
    if (router?.query?.status) {
      setStatusQuery(router?.query?.status as string);
    }
  }, [router?.query]);

  const retryConfirmOrder = (id: string, phone: string) => {
    retryConfirmQuery({ orderId: id, phone });
  };

  const handleMessageWsp = (phone: string, name: string) => {
    setOpen(true);
    setuserActiveToWsp({ phone, name });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Orden ID",
      width: 110,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.id.slice(-10);
      },
    },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "phone", headerName: "Teléfono", width: 120 },
    {
      field: "wspReceived",
      headerName: "Wsp",
      width: 20,
      renderCell: ({ row }: GridValueGetterParams) => {
        if (row?.wspReceived === true) {
          return <DoneAllOutlined color="success" sx={{ ml: 1 }} />;
        } else {
          return (
            <IconButton
              disabled={retryConfirmStatus.isLoading}
              onClick={() => retryConfirmOrder(row.id, row.phone)}
              color="error"
            >
              <ReplayOutlined />
            </IconButton>
          );
        }
      },
    },
    { field: "address", headerName: "Dirección", width: 250 },
    {
      field: "total",
      headerName: "Monto ",
      width: 80,
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
      headerName: "No.Prod.",
      align: "center",
      width: 80,
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
    { field: "createdAt", headerName: "Ingresada en", width: 160 },
    {
      field: "ticket",
      headerName: "Ticket",
      width: 80,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton
            onClick={() =>
              printOrder(
                dataOrders?.docs?.find((d) => d._id === row.id) as IOrder
              )
            }
          >
            <ConfirmationNumberOutlined />
          </IconButton>
        );
      },
    },
    {
      field: "wsp",
      headerName: "Msg",
      width: 80,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton onClick={() => handleMessageWsp(row.phone, row.name)}>
            <MessageOutlined />
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

  const rows = dataOrders?.docs!.map((order: IOrder) => ({
    id: order?._id,
    wspReceived: order?.wspReceived,
    name: order.shippingAddress.username!,
    total: order?.total,
    address: `${order.shippingAddress.address}`,
    status: order?.status,
    phone: order.shippingAddress.phone,
    noProducts: order?.numberOfItems,
    createdAt: format(new Date(order?.createdAt!), "dd-MM-yyyy hh:mm:ss"),
    extras: order?.orderExtraItems?.length,
  }));

  return (
    <AdminLayout
      icon={<ConfirmationNumberOutlined />}
      title={"Ordenes"}
      subTitle={"Mantenimiento de ordenes"}
    >
      <MessageModal user={userActiveToWsp} open={open} setOpen={setOpen} />
      <Box display={"flex"} justifyContent="end">
        <OrdersActions
          rowsId={selectedRows}
          data={dataOrders.docs?.filter((d) => selectedRows.includes(d?._id!))}
        />
      </Box>
      <Grid
        className="fadeIn"
        container
        xs={12}
        height={"calc(100vh - 250px)"}
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
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(e) => setSelectedRows(e)}
          rows={rows ?? []}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            pagination: { classes: null },
          }}
        />
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
