import { NotificationsNoneOutlined } from "@mui/icons-material";
import { Box, IconButton, Badge } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FilterTabOrders, OrdersActions } from "../orders";
import AudioPlayer from "react-h5-audio-player";
import { useCountOrdersNumberQuery } from "../../store/RTKQuery/ordersApi";

export const BellNotification = () => {
  const [newOrdersAlert, setNewOrdersAlert] = useState<number | null>(0);
  const [ordersViews, setOrdersViews] = useState<number>();
  const { data: numberOfOrders } = useCountOrdersNumberQuery(null, {
    pollingInterval: 60000, // 1 minuto,
  });
  const alertSound = useRef() as React.LegacyRef<AudioPlayer>;
  const [isFirstRender, setisFirstRender] = useState(true);
  useEffect(() => {
    document.getElementById("iconbuttonBell")?.click();
  }, []);

  useEffect(() => {
    if (numberOfOrders && isFirstRender) {
      setisFirstRender(false);
      return;
    } else if (numberOfOrders && ordersViews) {
      setNewOrdersAlert(numberOfOrders - ordersViews);
    }
  }, [numberOfOrders, ordersViews]);

  useEffect(() => {
    if (isFirstRender && numberOfOrders) {
      setOrdersViews(numberOfOrders!);
    }
  }, [isFirstRender, numberOfOrders]);

  // efecto de vibracion campana
  useEffect(() => {
    if (newOrdersAlert !== 0) {
      document.getElementById("bellNotification")?.classList.add("shakeIcon");
      (alertSound as any)!.current?.audio.current.play();
    } else {
      document
        .getElementById("bellNotification")
        ?.classList.remove("shakeIcon");
    }
  }, [newOrdersAlert]);

  return (
    <Box display={"flex"} justifyContent="end">
      <AudioPlayer
        preload="metadata"
        src={"/sounds/notification-bell.wav"}
        ref={alertSound}
        style={{ display: "none" }}
      />
      <Box flexGrow={1}></Box>
      <IconButton
        id="iconbuttonBell"
        sx={{ marginRight: 2 }}
        // onClick={() => setNewOrdersAlert(0)}
        onClick={() => {
          setOrdersViews(numberOfOrders);
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
    </Box>
  );
};
