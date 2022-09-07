import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
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

  // if (!isError && !data) {
  //   return <></>;
  // }

  // if (isError) {
  //   return <Typography>Error al cargar los datos</Typography>;
  // }

  return (
    <AdminLayout
      icon={<DashboardOutlined />}
      title="Dashboard"
      subTitle="Estadisticas generales"
    >
      <Grid container spacing={2}>
        <SummaryTitle
          title={data?.numberOfOrders.toString()!}
          subTitle={"Ordenes totales"}
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={data?.paidOrders.toString()!}
          subTitle={"Ordenes pagadas"}
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={data?.notPaidOrders.toString()!}
          subTitle={"Ordenes pendientes"}
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={data?.numberOfClients.toString()!}
          subTitle={"Clientes"}
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
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
          title={data?.lowInventory.toString()!}
          subTitle={"Bajo inventario"}
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
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
