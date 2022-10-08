import React, { useState } from "react";
import { MessageModal } from "../components/orders/MessageModal";

export const useSendDirectMessage = () => {
  const [userActiveToWsp, setuserActiveToWsp] = useState({
    phone: "",
    name: "",
  });
  const [open, setOpen] = useState(false);

  const MessageModalComponent: React.FunctionComponent = () => (
    <MessageModal user={userActiveToWsp} open={open} setOpen={setOpen} />
  );

  return [MessageModalComponent, setuserActiveToWsp, setOpen] as const;
};
