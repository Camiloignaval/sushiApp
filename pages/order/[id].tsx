import React, { FC, useEffect } from "react";
import { GetServerSideProps } from "next";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { ShopLayout } from "../../components/layouts";
import { Stepper, Step, StepLabel, Typography, Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import {
  Countertops,
  DoneAll,
  HomeOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import Image from "next/image";

interface Props {
  order: IOrder;
}

const OrderInfoPage: FC<Props> = ({ order }) => {
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <ContentPasteIcon />,
      2: <Countertops />,
      3: <DeliveryDiningIcon />,
      4: <DoneAll />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const steps = ["Ingresada", "En proceso", "Despachada", "Entregada"];
  const stepinBd = ["ingested", "inprocess", "dispatched", "delivered"];

  return (
    <ShopLayout
      title={"Sigue tu pedido"}
      pageDescription={"Pagina para seguir el estado del pedido"}
    >
      <Stepper
        alternativeLabel
        activeStep={stepinBd.findIndex((step) => step === order.status)}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container mt={4}>
        <Grid item xs={1}></Grid>
        <Grid item xs={11}>
          <Typography variant="subtitle1">
            <PersonOutlineOutlined sx={{ position: "relative", top: 5 }} />{" "}
            {order.shippingAddress.username}
          </Typography>{" "}
          <Typography variant="subtitle1">
            <HomeOutlined sx={{ position: "relative", top: 5 }} />{" "}
            {order.shippingAddress.address}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Image
          layout="fixed"
          width={"400px"}
          height={"400px"}
          src="https://res.cloudinary.com/dc6vako2z/image/upload/v1663116833/SushiApp/tumblr_o1ligs21271uswgqqo1_400_wtaavy.webp"
          alt=""
        />
      </Box>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = "" } = query;
  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  return {
    props: { order },
  };
};

export default OrderInfoPage;