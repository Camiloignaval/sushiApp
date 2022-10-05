import nc from "next-connect";
import cors from "cors";
import axios from "axios";

const print = nc(/* { req, res } */)
  .use(cors())
  .post(async (req, res) => {
    const body = req.body;
    const { data } = await axios.post("http://localhost:8000/imprimir", body);
    res.json(data);
  });

export default print;
