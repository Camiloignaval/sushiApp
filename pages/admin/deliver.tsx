import {
  AddOutlined,
  DeliveryDiningOutlined,
  DoneAll,
} from "@mui/icons-material";
import { Box, Button, Grid, IconButton } from "@mui/material";
import {
  GridRowId,
  GridColDef,
  GridValueGetterParams,
  DataGrid,
  esES,
} from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastIcon } from "react-hot-toast";
import Swal from "sweetalert2";
import { AdminLayout } from "../../components/layouts";
import { FullScreenLoading } from "../../components/ui";
import { IOrder } from "../../interfaces";
import {
  useChangeOrderStatusMutation,
  useGetAllOrdersQuery,
} from "../../store/RTKQuery/ordersApi";
import { optimizeRoute } from "../../utils/optimizeRoute";

type googleObject = {
  distance: google.maps.Distance | undefined;
  duration: google.maps.Duration | undefined;
  end_address: string;
  ll: string;
}[];

const llHouse = "-33.50191475728067,-70.77686150347802";

const DeliverPage = () => {
  const toHouse = useRef(null);
  const [changeStatus, changeStatusState] = useChangeOrderStatusMutation();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const { data: dataOrders, isLoading } = useGetAllOrdersQuery(
    `status=dispatched&page=${page + 1}&limit=${pageSize}`
  );
  const [rowCountState, setRowCountState] = React.useState(
    dataOrders?.totalDocs || 0
  );
  const [routeOptimized, setRouteOptimized] = useState<googleObject | null>(
    null
  );
  const [rowsInDelivery, setRowsInDelivery] = useState<any>([]);

  // revisar si hay ruta en localstorage
  useEffect(() => {
    if (localStorage.getItem("orderDelivery")) {
      const local = localStorage.getItem("orderDelivery");
      setRouteOptimized(JSON.parse(local!));
    }
  }, []);

  const calculateRoute = async () => {
    if (dataOrders && dataOrders.docs?.length > 0) {
      const placeIds = (dataOrders.docs as IOrder[]).map(
        (order) => order.shippingAddress.placeId
      );
      const orderAddress =
        placeIds?.length > 0 ? await optimizeRoute(placeIds as string[]) : null;
      if (orderAddress) {
        const objetoToSet = orderAddress.map(
          ({ distance, duration, end_address, end_location }) => {
            return {
              distance,
              duration,
              end_address,
              ll: `${end_location.lat()},${end_location.lng()}`,
            };
          }
        );
        objetoToSet.splice(objetoToSet.length - 1);
        setRouteOptimized(objetoToSet);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Orden ID",
      minWidth: 95,
      flex: 1,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.id.slice(-10);
      },
    },
    { field: "address", headerName: "Dirección", minWidth: 220, flex: 1 },
  ];
  const OnPressCheckDeliver = async (id: string, street: string) => {
    try {
      Swal.fire({
        title: `Entregaste el pedido en la dirección ${street}`,
        text: "¿Estás seguro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, Entregado",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await changeStatus({ ids: [id], newStatus: "delivered" }).unwrap();
          const arrWithOutAdress = routeOptimized?.filter(
            (r) => r.end_address !== street
          );
          setRouteOptimized(
            (arrWithOutAdress ?? []).length > 0 ? (arrWithOutAdress as any) : []
          );
        }
      });
    } catch (error) {
      toast.error("Ha ocurrido un problema");
    }
  };

  const onFinishDeliver = () => {
    localStorage.removeItem("orderDelivery");
    setRouteOptimized(null);
  };

  useEffect(() => {
    if (routeOptimized) {
      if (routeOptimized.length === 0) {
        // consultar si quiere finalizar
        Swal.fire({
          title: `Has entregado todos los pedidos!`,
          text: "¿Que deseas hacer?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Solo finalizar",
          confirmButtonText: "Finalizar, ir a casa",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // finalizar y dirigir a casa
            onFinishDeliver();
            (toHouse.current! as any).click();
          } else {
            // solo finalizar
            onFinishDeliver();
          }
        });
      } else {
        localStorage.setItem("orderDelivery", JSON.stringify(routeOptimized));
      }
    }
  }, [routeOptimized]);

  const columnsInDelivery: GridColDef[] = [
    {
      field: "id",
      headerName: "Orden ID",
      minWidth: 95,
      flex: 1,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.id.slice(-10);
      },
    },
    {
      field: "address",
      headerName: "Dirección",
      minWidth: 160,
      flex: 1,
      renderCell: ({ row }: GridValueGetterParams) => {
        // const comuna = row.address?.trim()?.split(",", 2)[1].trim();
        // const direction = row.address?.trim()?.split(",", 1)[0]?.split(" ");
        // const numeration = direction?.pop();
        // direction.unshift(numeration);
        // direction.push(comuna);
        return (
          <a
            style={{ color: "black" }}
            href={`https://waze.com/ul?ll=${row.ll}&navigate=yes`}
            // href={`waze://waze.com/ul?ll=${row.ll}&navigate=yes`}
            target="_blank"
            rel="noreferrer"
          >
            {row.address.split(",", 2)}
          </a>
        );
      },
    },
    {
      field: "deliver",
      flex: 1,
      headerName: "Entrega",
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton
            onClick={() => OnPressCheckDeliver(row.id, row.address)}
            color="success"
            disabled={changeStatusState.isLoading}
          >
            <DoneAll />
          </IconButton>
        );
      },
    },
    { field: "time", headerName: "Tiempo", minWidth: 70, flex: 1 },
    { field: "distance", headerName: "Distancia", minWidth: 70, flex: 1 },
  ];

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      dataOrders?.totalDocs !== undefined
        ? dataOrders?.totalDocs
        : prevRowCountState
    );
  }, [dataOrders?.totalDocs, setRowCountState]);

  useEffect(() => {
    if (routeOptimized && dataOrders) {
      try {
        const rowsPreparadas = routeOptimized.map((ad) => ({
          id: dataOrders?.docs?.find(
            (d) =>
              ad!.end_address.split(",", 1)[0] ===
              d.shippingAddress!.address.split(",", 1)[0]
          )?._id,
          time: ad?.duration?.text,
          distance: ad?.distance?.text,
          address: ad.end_address,
          ll: ad.ll,
        }));
        if (rowsPreparadas.find((r) => r.id === undefined)) throw Error;
        setRowsInDelivery(rowsPreparadas);
      } catch (error) {
        console.log({ error });
        toast.error("Ha ocurrido un error, calcule ruta nuevamente");
        onFinishDeliver();
      }
    }
  }, [routeOptimized, dataOrders]);

  if (!dataOrders) return <FullScreenLoading />;

  const rows = dataOrders!.docs.map((order: IOrder) => ({
    id: order?._id,
    address: `${order.shippingAddress.address.split(",", 2)}`,
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
      <Link
        style={{ color: "black", display: "none" }}
        href={`https://waze.com/ul?ll=${llHouse}&navigate=yes`}
        // href={`waze://waze.com/ul?ll=${llHouse}&navigate=yes`}
        target="_blank"
        rel="noreferrer"
      >
        <a ref={toHouse}></a>
      </Link>
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        {routeOptimized ? (
          <Button color="error" onClick={onFinishDeliver}>
            Finalizar ruta
          </Button>
        ) : (
          <Button color="secondary" onClick={calculateRoute}>
            Iniciar ruta!
          </Button>
        )}
      </Box>
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
          rows={routeOptimized ? rowsInDelivery : rows ?? []}
          columns={routeOptimized ? columnsInDelivery : columns}
          componentsProps={{
            pagination: { classes: null },
          }}
        ></DataGrid>
      </Grid>
    </AdminLayout>
  );
};

export default DeliverPage;
