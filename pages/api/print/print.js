import nc from "next-connect";
import cors from "cors";
import axios from "axios";

const print = nc(/* { req, res } */)
  .use(cors())
  .post(async (req, res) => {
    const body = req.body;
    console.log("mensaje desde nc:", body);
    const { data } = await axios.post(
      "http://localhost:8000/imprimir",
      JSON.stringify(body)
    );
    res.json(data);
  });

export default print;
