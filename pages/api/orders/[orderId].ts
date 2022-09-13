import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return getOrder(req, res);

    default:
      return res.status(405).json({
        message: "Method Not Allowed",
      });
  }
}

const getOrder = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  return res.status(200).json({
    message: "bien",
  });
};
