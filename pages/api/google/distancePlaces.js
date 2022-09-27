import nc from "next-connect";
import cors from "cors";
import axios from "axios";

const distancePlaces = nc()
  .use(cors())
  .post(async (req, res) => {
    const { destino = "", origen = "" } = req.body;
    const { data } = await axios(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:${destino}&origins=place_id:${origen}&units=imperial&key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw`
    );
    res.json(data);
  });

export default distancePlaces;
