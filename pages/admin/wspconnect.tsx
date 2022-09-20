import axios from "axios";
import React, { useEffect } from "react";
import qrcode from "qrcode-terminal";
import { Button } from "@mui/material";

const WspconnectPage = () => {
  useEffect(() => {
    // (async () => {
    //   try {
    //     const resp = await axios.post(
    //       "http://localhost:3000/api/admin/wspconnect"
    //     );
    //     qrcode.generate(resp?.data?.qr, { small: true });
    //   } catch (error) {
    //     console.log({ error });
    //   }
    // })();
  }, []);

  return (
    <>
      <div>Page</div>
      <Button
        color="primary"
        onClick={() =>
          axios.put("http://localhost:3000/api/admin/wspconnect", {
            number: "56945706195",
            msg: "desde pagina",
          })
        }
      >
        Click aqui
      </Button>
    </>
  );
};

export default WspconnectPage;
