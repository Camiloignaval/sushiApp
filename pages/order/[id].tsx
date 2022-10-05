import React, { FC, useEffect, useState } from "react";
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
import { useSearchOrderByIdQuery } from "../../store/RTKQuery/ordersApi";
import { FullScreenLoading } from "../../components/ui";
import confetti from "canvas-confetti";
import { first, orderBy } from "lodash";
import { useRouter } from "next/router";

// interface Props {
//   order: IOrder;
// }

const ingestedGif =
  "https://res.cloudinary.com/dc6vako2z/image/upload/v1663116833/SushiApp/tumblr_o1ligs21271uswgqqo1_400_wtaavy.webp";
const inprocessGif =
  "https://res.cloudinary.com/dc6vako2z/image/upload/v1664418614/SushiApp/making-food-food_folwnk.gif";
const deliveryGif =
  "https://res.cloudinary.com/dc6vako2z/image/upload/v1664418581/SushiApp/a7c1a9375f2d007d601e2bb7e815fdcc_ljrmzu.gif";
const dispatchedGif =
  "https://res.cloudinary.com/dc6vako2z/image/upload/v1664416497/SushiApp/pig-piglet_hpp7m2.gif";

const OrderInfoPage /* : FC<Props> */ = (/* { order: orderByServer } */) => {
  const router = useRouter();
  const [id, setId] = useState<string | null>();
  // const { id } = router.query.id;
  const { data: order, isLoading } = useSearchOrderByIdQuery(
    // orderByServer._id!,
    router.query.id as string,
    {
      pollingInterval: 30000, // 1 minuto,
    }
  );
  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setId(id as string);
    }
  }, [router.query]);

  console.log({ id: router.query.id });
  const [orderToShow, setOrderToShow] =
    useState<IOrder | null>(/* orderByServer */);
  console.log({ order });
  useEffect(() => {
    if ((order as IOrder)?._id) {
      setOrderToShow(order as IOrder);
    }
  }, [order]);

  useEffect(() => {
    var colors = ["#bb0000", "#ffffff"];

    if (order && !isLoading) {
      if ((order as IOrder)?.status === "delivered") {
        confetti({
          particleCount: 400,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 400,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });
      }
    }
  }, [order, isLoading]);

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

  if (!order || isLoading || !id) return <FullScreenLoading />;

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
      title="Sigue tu pedido"
      pageDescription="Página para ver estado de pedido"
      imageFullUrl="https://res.cloudinary.com/dc6vako2z/image/upload/v1664357167/SushiApp/logo-sushi-panko_qtifjs.webp"
    >
      {!order || isLoading ? (
        <FullScreenLoading />
      ) : (
        <>
          <Stepper
            alternativeLabel
            activeStep={stepinBd.findIndex(
              (step) => step === (orderToShow as IOrder)?.status
            )}
            connector={<ColorlibConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container mt={4}>
            <Grid item xs={1}></Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle1">
                <PersonOutlineOutlined sx={{ position: "relative", top: 5 }} />{" "}
                {(orderToShow as IOrder)?.shippingAddress?.username}
              </Typography>{" "}
              <Typography variant="subtitle1">
                <HomeOutlined sx={{ position: "relative", top: 5 }} />{" "}
                {(orderToShow as IOrder)?.shippingAddress?.address}
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Image
              style={{
                borderRadius: "15px",
                borderImage: "revert",
              }}
              layout="fixed"
              width={"300px"}
              height={"300px"}
              src={
                (orderToShow as IOrder)?.status === "ingested"
                  ? ingestedGif
                  : (order as IOrder)?.status === "inprocess"
                  ? inprocessGif
                  : (order as IOrder)?.status === "dispatched"
                  ? deliveryGif
                  : dispatchedGif
              }
              alt=""
            />
          </Box>
        </>
      )}
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { id = "" } = query;
//   const order = await dbOrders.getOrderById(id.toString());

//   if (!order) {
//     return {
//       redirect: {
//         destination: `/`,
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { order },
//   };
// };

export default OrderInfoPage;
