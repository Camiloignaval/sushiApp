import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  AutoGraphOutlined,
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
  InsertEmoticonOutlined,
  LocalOffer,
  MoneyOffOutlined,
  MoneyOutlined,
  OutdoorGrillOutlined,
  PriorityHighOutlined,
  ProductionQuantityLimitsOutlined,
  SaveOutlined,
  SentimentNeutralOutlined,
  SentimentVeryDissatisfiedOutlined,
  SsidChartOutlined,
  StarPurple500,
} from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
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
import { GraficoDash } from "../../components/ui";
import { useUpdateGainsMutation } from "../../store/RTKQuery/expenses";
import { styled } from "@mui/material/styles";

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

  const { data, refetch, isLoading } = useGetDashboardDataQuery(queryToSend);
  const [updateGains] = useUpdateGainsMutation();

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
    setTitleMessage("de la semana actual");
  };

  const handleCloseWeek = () => {
    updateGains(data?.ganancias ?? 0);
  };

  return (
    <AdminLayout
      icon={<DashboardOutlined />}
      title="Dashboard"
      subTitle={`Estadisticas generales ${titleMessage}`}
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
        <Button
          onClick={handleCloseWeek}
          // disabled={updateCouponState.isLoading}
          color="primary"
          sx={{ width: "150px" }}
          type="submit"
        >
          Cerrar semana
        </Button>
      </Box>
      <Grid container mt={4} position="relative">
        <Box flexGrow={1} my={5}></Box>
        <Grid item xs={6} md={3}>
          <DatePickerStart />
        </Grid>
        <Grid item xs={6} md={3}>
          <DatePickerEnd />
        </Grid>
        {/* <DatePickerStart />
        <DatePickerEnd /> */}

        <Box
          sx={{
            position: { xs: "absolute", md: "initial" },
            bottom: 5,
            right: 0,
          }}
        >
          <IconButton onClick={handleFilter} size="small" color="primary">
            <FilterList />
          </IconButton>
          <IconButton onClick={onCleanFilters} size="small" color="primary">
            <ClearOutlined />
          </IconButton>
        </Box>
      </Grid>

      <Grid container spacing={2}>
        <SummaryTitle
          sizeInMd={6}
          isLoading={isLoading}
          title={currency.format(data?.ganancias ?? 0)}
          subTitle={"Ganancia semanal"}
          icon={
            data?.ganancias! < 0 ? (
              <SentimentVeryDissatisfiedOutlined
                color="error"
                sx={{ fontSize: 40 }}
              />
            ) : data?.ganancias! > 0 ? (
              <InsertEmoticonOutlined color="success" sx={{ fontSize: 40 }} />
            ) : (
              <SentimentNeutralOutlined color="primary" sx={{ fontSize: 40 }} />
            )
          }
          color={
            data?.ganancias! < 0
              ? "error"
              : data?.ganancias! > 0
              ? "green"
              : "black"
          }
        />
        <SummaryTitle
          sizeInMd={6}
          isLoading={isLoading}
          title={currency.format(data?.bills ?? 0)}
          subTitle={"Gastos semanal"}
          icon={<MoneyOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      <Divider sx={{ my: 4, mx: 4, display: "block" }} />

      <Grid container spacing={2}>
        <SummaryTitle
          sizeInMd={4}
          isLoading={isLoading}
          title={currency.format(data?.inTotal ?? 0)}
          subTitle={"Ingreso bruto"}
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          sizeInMd={4}
          isLoading={isLoading}
          title={currency.format(data?.inByDelivery ?? 0)}
          subTitle={"Ingresos por despacho"}
          icon={
            <DeliveryDiningOutlined color="success" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          sizeInMd={4}
          isLoading={isLoading}
          title={currency.format(data?.discount ?? 0)}
          subTitle={"Descuento utilizado"}
          icon={<LocalOffer color="error" sx={{ fontSize: 40 }} />}
        />
      </Grid>

      <Divider sx={{ my: 4, mx: 4, display: "block" }} />
      <Grid container spacing={2}>
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=ingested,inprocess,dispatched,delivered&onlyWeek=true"
          title={data?.numberOfOrders.toString()!}
          subTitle={"Ordenes totales"}
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=ingested&onlyWeek=true"
          title={data?.numberOfOrdersIngresadas.toString()!}
          subTitle={"Ordenes en espera"}
          icon={<HourglassBottomOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=inprocess&onlyWeek=true"
          title={data?.numberOfOrdersEnProceso.toString()!}
          subTitle={"Ordenes en proceso"}
          icon={<OutdoorGrillOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=dispatched&onlyWeek=true"
          title={data?.numberOfOrdersDespachadas.toString()!}
          subTitle={"Ordenes despachadas"}
          icon={
            <DeliveryDiningOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          isLoading={isLoading}
          link="/admin/orders?status=delivered&onlyWeek=true"
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
        <SummaryTitle
          isLoading={isLoading}
          title={`${data?.avgTime ?? "- "} min.`}
          subTitle={"Tiempo promedio de entrega"}
          icon={
            <PriorityHighOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />
      </Grid>
      <Divider sx={{ my: 4, mx: 4, display: "block" }} />

      <Box mt={4}>
        <Typography
          sx={{ display: "flex", justifyContent: "center" }}
          variant="h5"
        >
          Histórico Ganancias vs Gastos
        </Typography>
        <GraficoDash data={data?.dataGrafico ?? []} />
      </Box>
    </AdminLayout>
  );
};

export default DashBoardPage;
