import {
  PhoneAndroidOutlined,
  FilterList,
  ClearOutlined,
} from "@mui/icons-material";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMultipleSelect, useDatePicker } from "../../hooks";
import { setFilters } from "../../store/Slices/UISlice";

const statusValues = [
  { name: "Ingresada", value: "ingested" },
  { name: "En proceso", value: "inprocess" },
  { name: "Despachada", value: "dispatched" },
  { name: "Entregadas", value: "delivered" },
];

interface Props {
  refetch: () => void;
}

export const FilterTabOrders: FC<Props> = ({ refetch }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [SelectStatus, statusChoose, setStatusChoose] = useMultipleSelect({
    label: "Estado de orden",
    values: statusValues,
  });
  const [DatePickerStart, startChoose, setStart] = useDatePicker({
    label: "Fecha de inicio",
  });
  const [DatePickerEnd, endChoose, setEnd] = useDatePicker({
    label: "Fecha de término",
  });
  const [phoneToFind, setPhoneToFind] = useState("");

  const handleFilter = () => {
    console.log({ statusChoose, startChoose, endChoose, phoneToFind });
    dispatch(
      setFilters({
        status: statusChoose as any,
        startDate: startChoose,
        endDate: endChoose,
        phoneToFind,
      })
    );
    refetch();
  };

  const onCleanFilters = () => {
    setStatusChoose([]);
    setStart(null);
    setEnd(null);
    setPhoneToFind("");
    dispatch(
      setFilters({
        status: [],
        startDate: null,
        endDate: null,
        phoneToFind: "",
      })
    );
  };

  useEffect(() => {
    if (router.isReady && router?.query?.status) {
      console.log({ status: router?.query?.status });
      setStatusChoose((router?.query?.status as string).split(","));
      dispatch(
        setFilters({
          status: (router?.query?.status as any).split(","),
          startDate: null,
          endDate: null,
          phoneToFind: "",
        })
      );
    }
  }, [router.isReady]);

  return (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      <SelectStatus />
      <DatePickerStart />
      <DatePickerEnd />
      <TextField
        type={"number"}
        value={phoneToFind}
        onChange={(e) => setPhoneToFind(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneAndroidOutlined />
              +56
            </InputAdornment>
          ),
        }}
        sx={{ display: "flex", alignSelf: "center", marginRight: 1 }}
        size="small"
      />
      <IconButton onClick={handleFilter} size="small" color="primary">
        <FilterList />
      </IconButton>
      <IconButton onClick={onCleanFilters} size="small" color="primary">
        <ClearOutlined />
      </IconButton>
    </Box>
  );
};
