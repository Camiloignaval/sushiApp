import {
  AccountBalanceWalletOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Grid,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { format, startOfDay } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { useDatePicker } from "../../hooks";
import { useGetExpensesOfWeekQuery } from "../../store/RTKQuery/expenses";
import esLocale from "date-fns/locale/es";
import { ExpensesTable } from "../../components/expenses";

const BillsPage = () => {
  const buttonSubmitForm = useRef() as React.RefObject<HTMLButtonElement>;
  const [DatePickerSelect, selectDay, setValue] = useDatePicker({
    label: "Seleccione semana",
    disableFuture: false,
  });
  const [dayToFind, setDayToFind] = useState(
    getMonday(new Date()).toISOString()
  );
  const {
    data: expensesData,
    isFetching,
    refetch,
  } = useGetExpensesOfWeekQuery(dayToFind);

  function getMonday(d: any) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return startOfDay(new Date(d.setDate(diff)));
  }

  const handleSearch = () => {
    const startOfWeekend = getMonday(selectDay).toISOString();
    setDayToFind(startOfWeekend);
  };

  useEffect(() => {
    refetch();
  }, [dayToFind]);

  return (
    <AdminLayout
      title="Gastos"
      icon={<AccountBalanceWalletOutlined />}
      subTitle={`Administrador de gastos`}
    >
      <>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            onClick={() => buttonSubmitForm!.current!.click()}
            // disabled={updateCouponState.isLoading}
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
          >
            Guardar
          </Button>
        </Box>
        <Box
          display={"flex"}
          position="relative"
          alignContent="center"
          justifyContent="space-between"
        >
          <Grid container mt={4} xs={12}>
            <Grid item xs={12} sm={7}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: {
                    xs: "25px",
                    md: "40px",
                  },
                  position: "relative",
                  bottom: 7,
                  display: "flex",
                  justifyContent: { xs: "start", sm: "start" },
                  marginBottom: 2,
                }}
                // variant="h4"
              >{`Semana del ${format(new Date(dayToFind), "dd MMMM yyyy", {
                locale: esLocale,
              })}`}</Typography>
            </Grid>
            <Grid item xs>
              <Box mb={2} display="flex" justifyContent={"end"}>
                <DatePickerSelect />
                <IconButton
                  disabled={!selectDay}
                  onClick={handleSearch}
                  color="primary"
                >
                  <SearchOutlined />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mb: 4 }} />

        <ExpensesTable
          isFetching={true}
          buttonSubmitForm={buttonSubmitForm}
          expensesData={
            expensesData
              ? expensesData
              : {
                  week: getMonday(new Date(dayToFind)).toISOString(),
                  bills: [],
                }
          }
        />

        {/* <ExpensesTable
          expensesData={
            expensesData ?? {
              week: getMonday(new Date()).toISOString(),
              bills: [],
            }
          }
          buttonSubmitForm={buttonSubmitForm}
        /> */}
      </>
    </AdminLayout>
  );
};

export default BillsPage;
