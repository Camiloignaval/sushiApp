import {
  ConfirmationNumberOutlined,
  DoneAllOutlined,
  MessageOutlined,
  NotificationsNoneOutlined,
  ReplayOutlined,
  WarningOutlined,
  WhatsApp,
} from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";

import { Badge, Box, Chip, Grid, IconButton, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueGetterParams,
  esES,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AdminLayout } from "../../../components/layouts";
import {
  FilterTabOrders,
  MessageModal,
  OrdersActions,
} from "../../../components/orders";
import { FullScreenLoading } from "../../../components/ui";
import { IOrder, IOrderWithPaginate } from "../../../interfaces";
import {
  useGetAllOrdersQuery,
  useRetryConfirmOrderMutation,
} from "../../../store/RTKQuery/ordersApi";
import { currency } from "../../../utils";
import { printOrder } from "../../../utils/printOrder";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Typography from "@mui/material/Typography";
import { useSendDirectMessage } from "../../../hooks";

const OrdersPage = () => {
  const [dataOrders, setDataOrders] = useState<IOrderWithPaginate | null>(null);
  const [newOrdersAlert, setNewOrdersAlert] = useState<number | null>(0);
  const alertSound = useRef() as React.LegacyRef<AudioPlayer>;
  const [rowCountState, setRowCountState] = useState(
    dataOrders?.totalDocs || 0
  );
  const [MessageModal, setuserActiveToWsp, setOpen] = useSendDirectMessage();
  const [rowCountStateOld, setRowCountStateOld] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [retryConfirmQuery, retryConfirmStatus] =
    useRetryConfirmOrderMutation();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const { endDate, phoneToFind, startDate, status } = useSelector(
    (state: RootState) => state.ui.filters
  );
  const { data, isLoading, refetch } = useGetAllOrdersQuery(
    `page=${page + 1}&limit=${pageSize}${
      status.length > 0 ? `&status=${status}` : ""
    }${
      startDate !== null
        ? `&startDate=${new Date(startDate).toISOString()}`
        : ""
    }${endDate !== null ? `&endDate=${new Date(endDate).toISOString()}` : ""}${
      phoneToFind !== "" ? `&phoneToFind=56${phoneToFind}` : ""
    }`,
    {
      pollingInterval: 60000, // 1 minuto,
    }
  );

  useEffect(() => {
    refetch();
  }, [endDate, phoneToFind, startDate, status]);

  useEffect(() => {
    if (data) {
      setDataOrders(data);
    }
  }, [data]);

  useEffect(() => {
    document.getElementById("iconbuttonBell")?.click();
  }, []);

  // efecto de vibracion campana
  useEffect(() => {
    if (newOrdersAlert !== 0) {
      document.getElementById("bellNotification")?.classList.add("shakeIcon");
    } else {
      document
        .getElementById("bellNotification")
        ?.classList.remove("shakeIcon");
    }
  }, [newOrdersAlert]);

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
      renderCell: ({ row }: GridValueGetterParams) => (
        <a
          style={{ color: "black" }}
          href={`/admin/orders/${row.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {row.id.slice(-10)}
        </a>
      ),
      // return row.id.slice(-10);
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
      field: "reserved",
      width: 125,
      headerName: "Reserva",
      renderCell: ({ row }: GridValueGetterParams) => {
        if (row?.reservedHour) {
          const leftMinutes = Math.round(
            (new Date(row?.reservedHour).getTime() - new Date().getTime()) /
              (1000 * 60)
          );
          return (
            <>
              <Typography
                variant="body2"
                color={
                  !["delivered"].includes(row?.status) && leftMinutes <= 60
                    ? "error"
                    : "primary"
                }
              >
                {format(new Date(row?.reservedHour), "dd-MM HH:mm")}
              </Typography>
              {!["delivered"].includes(row?.status) && leftMinutes <= 60 && (
                <Tooltip
                  title={
                    leftMinutes > 0
                      ? `Quedan ${leftMinutes} minutos para la hora reservada!`
                      : `Orden debería haber sido entregada hace ${-leftMinutes} minutos!`
                  }
                >
                  <IconButton sx={{ paddingLeft: 0 }}>
                    <WarningOutlined color="error" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          );
        } else {
          return null;
        }
      },
    },
    {
      field: "createdAt",
      headerName: "Ingresada en",
      width: 160,
      renderCell: ({ row }: GridValueGetterParams) => {
        if (!row?.reservedHour) {
          const passedMinutes = Math.round(
            (new Date().getTime() - new Date(row?.createdAt).getTime()) /
              (1000 * 60)
          );
          return (
            <>
              <Typography
                variant="body2"
                color={
                  !["delivered"].includes(row?.status) && passedMinutes > 60
                    ? "error"
                    : "primary"
                }
              >
                {format(new Date(row?.createdAt), "dd-MM-yyyy HH:mm")}
              </Typography>
              {!["delivered"].includes(row?.status) && passedMinutes > 60 && (
                <Tooltip
                  title={`Ya han pasado ${passedMinutes} minutos de que ingresó el pedido!`}
                >
                  <IconButton sx={{ paddingLeft: 0 }}>
                    <WarningOutlined color="error" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          );
        } else {
          return format(new Date(row?.createdAt), "dd-MM-yyyy HH:mm");
        }
      },
    },
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
            <WhatsApp color="success" />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    if (rowCountState > 0) {
      if (rowCountState > rowCountStateOld! ?? rowCountState) {
        setNewOrdersAlert(rowCountState - rowCountStateOld! ?? rowCountState);
        (alertSound as any)!.current?.audio.current.play();
      }
    } else if (rowCountState < rowCountStateOld! ?? rowCountState) {
      setRowCountStateOld(rowCountState);
    } else {
      setNewOrdersAlert(0);
    }
  }, [rowCountState, rowCountStateOld]);

  useEffect(() => {
    if (rowCountStateOld === null) {
      setRowCountStateOld(dataOrders?.totalDocs ?? null);
    }
    setRowCountState((prevRowCountState) =>
      dataOrders?.totalDocs !== undefined
        ? dataOrders?.totalDocs
        : prevRowCountState
    );
  }, [dataOrders?.totalDocs, setRowCountState]);

  if (!dataOrders || !data) return <FullScreenLoading />;

  const rows = dataOrders?.docs!.map((order: IOrder) => ({
    id: order?._id,
    wspReceived: order?.wspReceived,
    name: order.shippingAddress.username!,
    total: order?.total,
    address: `${order.shippingAddress.address}`,
    status: order?.status,
    phone: order.shippingAddress.phone,
    noProducts: order?.numberOfItems,
    reservedHour: order?.reservedHour,
    createdAt: order?.createdAt,
    extras: order?.orderExtraItems?.length,
  }));

  return (
    <AdminLayout
      icon={<ConfirmationNumberOutlined />}
      title={"Ordenes"}
      subTitle={"Mantenimiento de ordenes"}
    >
      <MessageModal />
      <Box display={"flex"} justifyContent="end">
        <AudioPlayer
          preload="metadata"
          src={"/sounds/notification-bell.wav"}
          ref={alertSound}
          style={{ display: "none" }}
        />
        <FilterTabOrders refetch={refetch} />
        <Box flexGrow={1}></Box>
        <IconButton
          id="iconbuttonBell"
          sx={{ marginRight: 2 }}
          // onClick={() => setNewOrdersAlert(0)}
          onClick={() => {
            setRowCountStateOld(rowCountState);
            setNewOrdersAlert(0);
          }}
        >
          <Badge
            sx={{ display: "relative", right: 0 }}
            badgeContent={newOrdersAlert}
            color="secondary"
          >
            <NotificationsNoneOutlined id="bellNotification" />
          </Badge>
        </IconButton>
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
          // components={{
          //   Toolbar: GridToolbar,
          // }}
          componentsProps={{
            pagination: { classes: null },
          }}
        />
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
