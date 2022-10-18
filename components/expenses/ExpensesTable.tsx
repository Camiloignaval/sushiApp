import React, { FC, useEffect, useState } from "react";
import { IBills, IExpense } from "../../interfaces";
import { Form } from "antd";
import {
  Button,
  InputAdornment,
  IconButton,
  TextField,
  Grid,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useUpdateExpensesMutation } from "../../store/RTKQuery/expenses";
import { BillsTableSkeleton } from "../skeletons";
import { BulletList } from "react-content-loader";
import { getValue } from "@mui/system";
import { currency } from "../../utils";

interface Props {
  expensesData?: IExpense;
  buttonSubmitForm: React.RefObject<HTMLButtonElement>;
  isFetching: boolean;
}

export const ExpensesTable: FC<Props> = ({
  expensesData,
  buttonSubmitForm,
  isFetching,
}) => {
  const [updateExpenses] = useUpdateExpensesMutation();
  const [form] = Form.useForm();
  const onFinish = ({ bills }: any) => {
    try {
      // if (!bills || bills.length === 0) {
      //   toast.error("Debe guardar a lo menos 1 gasto");
      //   return;
      // }
      updateExpenses({ week: expensesData!.week!, bills: bills as IBills[] });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      bills: expensesData?.bills.map((e) => ({
        name: e.name,
        expense: e.expense,
      })),
    });
  }, [expensesData]);

  return (
    <>
      <Form
        name="dynamic_form_nest_item"
        preserve={false}
        initialValues={{
          bills: expensesData?.bills.map((e) => ({
            name: e.name,
            expense: e.expense,
          })),
        }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.List name="bills">
          {(fields, { add, remove }) => (
            <>
              {!isFetching ? (
                <BulletList />
              ) : (
                fields.map(({ key, name, ...restField }) => (
                  <Grid container spacing={2} mb={2} key={key}>
                    {" "}
                    <Grid item xs={1}>
                      <Box
                        display={"flex"}
                        flexDirection="column"
                        alignContent={"center"}
                        position={"relative"}
                        top={8}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => remove(name)}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[
                          {
                            required: true,
                            message: "Es necesaria descripción",
                          },
                        ]}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Descripción"
                        />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "expense"]}
                        rules={[
                          { required: true, message: "Es necesario costo" },
                        ]}
                      >
                        <TextField
                          size="small"
                          type={"number"}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          placeholder="Valor"
                        />
                      </Form.Item>
                    </Grid>
                  </Grid>
                ))
              )}
              {expensesData?.bills?.length! > 0 && (
                <>
                  <Divider sx={{ display: "flex", my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Typography variant="h4">
                      Gasto total:{" "}
                      {currency?.format(
                        (expensesData?.bills ?? []).reduce(
                          (acc, curr) => acc + curr.expense,
                          0
                        )
                      )}
                    </Typography>
                  </Box>
                </>
              )}

              <Form.Item>
                <Box mt={4} display={"flex"} justifyContent={"end"}>
                  <Button
                    size={"large"}
                    color="primary"
                    // type="dashed"
                    onClick={() => add()}

                    // icon={<PlusOutlined />}
                  >
                    <AddCircleOutline sx={{ mr: 2 }} />
                    Agregar
                  </Button>
                </Box>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button
            sx={{ display: "none" }}
            ref={buttonSubmitForm}
            color="secondary"
            type="submit"
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
