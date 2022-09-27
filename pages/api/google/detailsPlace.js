import nc from "next-connect";
import cors from "cors";
import axios from "axios";

const detailsPlace = nc(/* { req, res } */)
  .use(cors())
  .post(async (req, res) => {
    const { place_id } = req.body;
    const { data } = await axios(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw`
    );
    res.json(data);
  });

export default detailsPlace;
