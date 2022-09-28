import nc from "next-connect";
import cors from "cors";
import axios from "axios";

const print = nc(/* { req, res } */)
  .use(cors())
  .post(async (req, res) => {
    const { body } = req.body;
    console.log({ body });
    const resp = fetch("http://localhost:8000/imprimir_en", {
      method: "POST",
      body,
    })
      .then((r) => {
        res.json(r);
      })
      .catch((r) => {
        res.json(r);
      });
  });

export default print;
