import React, { FC, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { dbOrders } from "../../database";
import { IOrder, IProduct } from "../../interfaces";
import { ShopLayout } from "../../components/layouts";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Link as LinkScroll } from "react-scroll";
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
import { CardList, OrdenSummary } from "../../components/cart";
import { Extras } from "../../components/cart/Extras";

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
  // const [id, setId] = useState<string | null>();
  const { data: order, isLoading } = useSearchOrderByIdQuery(
    router.query.id as string,
    {
      pollingInterval: 30000, // 1 minuto,
    }
  );
  // useEffect(() => {
  //   const { id } = router.query;
  //   if (id) {
  //     setId(id as string);
  //   }
  // }, [router.query]);

  const [orderToShow, setOrderToShow] =
    useState<IOrder | null>(/* orderByServer */);
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

  if (!order || isLoading || !router.query.id) return <FullScreenLoading />;

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
          <Box
            sx={{
              height: { xs: "calc(100vh - 290px)", md: "" },
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

          {/* Resumen de compra */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <LinkScroll
                activeClass="active"
                to="bottom"
                spy={true}
                smooth={true}
                duration={500}
                offset={-80}
              >
                <Grid xs position={"relative"}>
                  <Box
                    display={{ xs: "flex", md: "none" }}
                    bottom={{ xs: "-3%", sm: "1%" }}
                    className="downArrow bounce"
                  >
                    <Image
                      width="40"
                      height="40"
                      alt=""
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSLQodC70L7QuV8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yNC4yODUsMTEuMjg0TDE2LDE5LjU3MWwtOC4yODUtOC4yODhjLTAuMzk1LTAuMzk1LTEuMDM0LTAuMzk1LTEuNDI5LDAgIGMtMC4zOTQsMC4zOTUtMC4zOTQsMS4wMzUsMCwxLjQzbDguOTk5LDkuMDAybDAsMGwwLDBjMC4zOTQsMC4zOTUsMS4wMzQsMC4zOTUsMS40MjgsMGw4Ljk5OS05LjAwMiAgYzAuMzk0LTAuMzk1LDAuMzk0LTEuMDM2LDAtMS40MzFDMjUuMzE5LDEwLjg4OSwyNC42NzksMTAuODg5LDI0LjI4NSwxMS4yODR6IiBmaWxsPSIjMTIxMzEzIiBpZD0iRXhwYW5kX01vcmUiLz48Zy8+PGcvPjxnLz48Zy8+PGcvPjxnLz48L3N2Zz4="
                    />
                  </Box>
                  <Box
                    display={{ xs: "flex", md: "none" }}
                    bottom={{ xs: "-3%", sm: "1%" }}
                    className="downArrow2 bounce"
                  >
                    <Image
                      width="40"
                      height="40"
                      alt=""
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSLQodC70L7QuV8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yNC4yODUsMTEuMjg0TDE2LDE5LjU3MWwtOC4yODUtOC4yODhjLTAuMzk1LTAuMzk1LTEuMDM0LTAuMzk1LTEuNDI5LDAgIGMtMC4zOTQsMC4zOTUtMC4zOTQsMS4wMzUsMCwxLjQzbDguOTk5LDkuMDAybDAsMGwwLDBjMC4zOTQsMC4zOTUsMS4wMzQsMC4zOTUsMS40MjgsMGw4Ljk5OS05LjAwMiAgYzAuMzk0LTAuMzk1LDAuMzk0LTEuMDM2LDAtMS40MzFDMjUuMzE5LDEwLjg4OSwyNC42NzksMTAuODg5LDI0LjI4NSwxMS4yODR6IiBmaWxsPSIjMTIxMzEzIiBpZD0iRXhwYW5kX01vcmUiLz48Zy8+PGcvPjxnLz48Zy8+PGcvPjxnLz48L3N2Zz4="
                    />
                  </Box>
                  <Typography
                    id="bottom"
                    variant="h2"
                    sx={{
                      marginBottom: 1,
                      mt: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Resumen orden
                  </Typography>
                </Grid>
              </LinkScroll>
              {/* card list */}
              <CardList orderProduct={order.orderItems} id={order._id} />
              <Extras
                productData={order.orderExtraItems as IProduct[]}
                id={order._id}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              {/* cart */}
              <Card className="summary-cart" sx={{ mt: 3 }}>
                <CardContent>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent={"space-between"}>
                    <Typography variant="subtitle1">
                      Dirección de entrega
                    </Typography>
                  </Box>
                  <Typography>{order.shippingAddress?.username}</Typography>
                  <Typography>{order.shippingAddress?.address}</Typography>
                  <Typography>{order.shippingAddress?.phone}</Typography>
                  <Divider sx={{ my: 1 }} />

                  <OrdenSummary order={order} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
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
    props: {},
  };
};

export default OrderInfoPage;
