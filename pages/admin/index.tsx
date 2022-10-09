import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  ClearOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DeliveryDiningOutlined,
  DiningOutlined,
  DoneAllOutlined,
  FilterList,
  GroupAddOutlined,
  GroupOutlined,
  HourglassBottomOutlined,
  LocalOffer,
  MoneyOutlined,
  OutdoorGrillOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { SummaryTitle } from "../../components/admin/SummaryTitle";
import { AdminLayout } from "../../components/layouts";
import { useDatePicker } from "../../hooks/useDatePicker";
import { useGetDashboardDataQuery } from "../../store/RTKQuery/adminApi";
import { currency } from "../../utils";
import esLocale from "date-fns/locale/es";
import Divider from "@mui/material/Divider";

const DashBoardPage = () => {
  const router = useRouter();
  const [DatePickerStart, startDate, setStart] = useDatePicker({
    label: "Fecha de inicio",
  });
  const [DatePickerEnd, endDate, setEnd] = useDatePicker({
    label: "Fecha de término",
  });
  const [titleMessage, setTitleMessage] = useState("de la semana actual");

  const [queryToSend, setqueryToSend] = useState<string | null>(null);

  const { data, refetch, isLoading } = useGetDashboardDataQuery(
    queryToSend
    //   {
    //   pollingInterval: 300000,
    // }
  );

  console.log({ data });

  const handleFilter = () => {
    if (startDate !== null && endDate !== null) {
      setqueryToSend(
        `?startDate=${new Date(startDate).toISOString()}&endDate=${new Date(
          endDate
        ).toISOString()}`
      );
      setTitleMessage(
        `${format(new Date(startDate), "EEEE d MMMM yy", {
          locale: esLocale,
        })} y ${format(new Date(endDate), "EEEE d MMMM yy", {
          locale: esLocale,
        })}`
      );
      refetch();
    } else {
      toast.error("Debe ingresar las dos fechas para filtrar datos");
    }
    // else {
    //   setqueryToSend(null);
    // }
  };

  const onCleanFilters = () => {
    setStart(null);
    setEnd(null);
    setqueryToSend(null);
    refetch();
  };

  // useEffect(() => {
  //   console.log("entre a useeffecrt");
  //   if (startDate !== null && endDate !== null) {
  //     setqueryToSend(
  //       `?startDate=${new Date(startDate).toISOString()}&endDate=${new Date(
  //         endDate
  //       ).toISOString()}`
  //     );
  //   } else {
  //     setqueryToSend(null);
  //   }
  // }, [startDate, endDate]);

  // const [refreshIn, setrefreshIn] = useState(30);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setrefreshIn((prev) => (prev > 0 ? prev - 1 : 30));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);
  // console.log({ ganancias: data?.ganancias });

  return (
    <AdminLayout
      icon={<DashboardOutlined />}
      title="Dashboard"
      subTitle={`Estadisticas generales ${titleMessage}`}
    >
      <Grid container>
        <Box flexGrow={1} my={5}></Box>
        <DatePickerStart />
        <DatePickerEnd />
        <IconButton onClick={handleFilter} size="small" color="primary">
          <FilterList />
        </IconButton>
        <IconButton onClick={onCleanFilters} size="small" color="primary">
          <ClearOutlined />
        </IconButton>
      </Grid>
      <Grid container spacing={2}>
        <SummaryTitle
          isLoading={isLoading}
          title={currency.format(
            data?.ganancias.reduce((acc, curr) => acc + curr.total, 0)
          )}
          subTitle={"Ingreso bruto"}
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          title={currency.format(
            data?.ganancias.reduce((acc, curr) => acc + curr.deliverPrice, 0)
          )}
          subTitle={"Ingresos por despacho"}
          icon={
            <DeliveryDiningOutlined color="success" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          isLoading={isLoading}
          title={currency.format(
            data?.ganancias.reduce((acc, curr) => acc + curr?.discount, 0)
          )}
          subTitle={"Descuento utilizado"}
          icon={<LocalOffer color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>

      <Divider sx={{ my: 4, mx: 4, display: "block" }} />
      <Grid container spacing={2}>
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=ingested,inprocess,dispatched,delivered"
          title={data?.numberOfOrders.toString()!}
          subTitle={"Ordenes totales"}
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=ingested"
          title={data?.numberOfOrdersIngresadas.toString()!}
          subTitle={"Ordenes en espera"}
          icon={<HourglassBottomOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=inprocess"
          title={data?.numberOfOrdersEnProceso.toString()!}
          subTitle={"Ordenes en proceso"}
          icon={<OutdoorGrillOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=dispatched"
          title={data?.numberOfOrdersDespachadas.toString()!}
          subTitle={"Ordenes despachadas"}
          icon={
            <DeliveryDiningOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=delivered"
          title={data?.numberOfOrdersEntregadas.toString()!}
          subTitle={"Ordenes entregadas"}
          icon={<DoneAllOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/users"
          title={data?.numberOfNewClients?.toString()! ?? 0}
          subTitle={"Nuevos clientes"}
          icon={<GroupAddOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/users"
          title={data?.numberOfClients.toString()!}
          subTitle={"Total clientes"}
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/products"
          title={data?.numberOfProducts.toString()!}
          subTitle={"Productos"}
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          title={data?.productsWithNoInventory.toString()!}
          subTitle={"Productos sin stock"}
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/promotions"
          title={data?.numberOfPromotions.toString()!}
          subTitle={"Promociones"}
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          title={data?.promotionsWithNoInventory.toString()!}
          subTitle={"Promociones sin stock"}
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        {/* <SummaryTitle
          title={refreshIn.toString()}
          subTitle={"Actualizacion en"}
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        /> */}
      </Grid>
    </AdminLayout>
  );
};

export default DashBoardPage;
