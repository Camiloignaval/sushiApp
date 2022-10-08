import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DeliveryDiningOutlined,
  DoneAllOutlined,
  GroupOutlined,
  HourglassBottomOutlined,
  OutdoorGrillOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SummaryTitle } from "../../components/admin/SummaryTitle";
import { AdminLayout } from "../../components/layouts";
import { useGetDashboardDataQuery } from "../../store/RTKQuery/adminApi";

const DashBoardPage = () => {
  const router = useRouter();
  const { data, error } = useGetDashboardDataQuery(null, {
    pollingInterval: 30000,
  });

  const [refreshIn, setrefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setrefreshIn((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout
      icon={<DashboardOutlined />}
      title="Dashboard"
      subTitle="Estadisticas generales"
    >
      <Grid container spacing={2}>
        <SummaryTitle
          link="/admin/orders?status=ingested,inprocess,dispatched,delivered"
          title={data?.numberOfOrders.toString()!}
          subTitle={"Ordenes totales"}
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          link="/admin/orders?status=ingested"
          title={data?.numberOfOrdersIngresadas.toString()!}
          subTitle={"Ordenes en espera"}
          icon={<HourglassBottomOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          link="/admin/orders?status=inprocess"
          title={data?.numberOfOrdersEnProceso.toString()!}
          subTitle={"Ordenes en proceso"}
          icon={<OutdoorGrillOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          link="/admin/orders?status=dispatched"
          title={data?.numberOfOrdersDespachadas.toString()!}
          subTitle={"Ordenes despachadas"}
          icon={
            <DeliveryDiningOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          link="/admin/orders?status=delivered"
          title={data?.numberOfOrdersEntregadas.toString()!}
          subTitle={"Ordenes entregadas"}
          icon={<DoneAllOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={data?.numberOfClients.toString()!}
          subTitle={"Clientes"}
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          link="/admin/products"
          title={data?.numberOfProducts.toString()!}
          subTitle={"Productos"}
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={data?.productsWithNoInventory.toString()!}
          subTitle={"Productos sin stock"}
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          link="/admin/promotions"
          title={data?.numberOfPromotions.toString()!}
          subTitle={"Promociones"}
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={data?.promotionsWithNoInventory.toString()!}
          subTitle={"Promociones sin stock"}
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          title={refreshIn.toString()}
          subTitle={"Actualizacion en"}
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashBoardPage;
