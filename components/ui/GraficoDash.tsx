import React, { useState, useEffect, FC } from "react";
import { Area, DualAxes, Line } from "@ant-design/plots";
import { IExpense } from "../../interfaces/expense";
import { format } from "date-fns";
import { currency } from "../../utils";
import { color } from "@mui/system";

interface Props {
  data: IExpense[];
}

export const GraficoDash: FC<Props> = ({ data: dataFromBackend }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (dataFromBackend) {
      const dataToSet: any = [];

      dataFromBackend
        .filter((d) => d?.bills?.length !== 0 && d?.gains)
        .map((d) => {
          const week = format(new Date(d?.week), "dd-MM-yyyy");
          const expense = d?.bills.reduce(
            (acc, curr) => acc + curr?.expense,
            0
          );
          const gains = d?.gains;

          dataToSet.push({ value: expense, week, type: "Gastos" });
          dataToSet.push({ value: gains, week, type: "Ganancias" });
        });
      // setDataExpenses(dataExpenses);
      // setDataGains(dataGains);
      setData(dataToSet);
    }
  }, [dataFromBackend]);

  const config = {
    data: data,
    xField: "week",
    yField: "value",
    seriesField: "type",
    smooth: true,

    yAxis: {
      label: {
        formatter: (v: string) => `${currency.format(+v)}`,
      },
    },
    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
    colorField: "type", // or seriesField in some cases
    color: ["#b30000", "#336600"],
  };

  return <Line {...config} />;
};
