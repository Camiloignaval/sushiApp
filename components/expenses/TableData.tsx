import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Box, IconButton, TextField, InputAdornment } from "@mui/material";
import { Form, Grid } from "antd";
import React from "react";
import { Button } from "react-scroll";

export const TableData = () => {
  const [updateExpenses] = useUpdateExpensesMutation();

  const onFinish = ({ bills }: any) => {
    try {
      if (!bills || bills.length === 0) {
        toast.error("Debe guardar a lo menos 1 gasto");
        return;
      }
      console.log({ week: expensesData!.week!, bills: bills as IBills[] });
      updateExpenses({ week: expensesData!.week!, bills: bills as IBills[] });
    } catch (error) {
      console.log({ error });
    }
  };
  console.log({
    bills: expensesData?.bills.map((e) => ({
      name: e.name,
      expense: e.expense,
    })),
  });
  return (
    <Form
      name="dynamic_form_nest_item"
      initialValues={{
        bills: expensesData?.bills.map((e) => ({
          name: e.name,
          expense: e.expense,
        })),
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.List name="bills">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Grid
                container
                spacing={2}
                mb={2}
                key={key}
                // style={{ display: "flex", marginBottom: 8 }}
                // align="baseline"
              >
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
                      { required: true, message: "Es necesaria descripción" },
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
                    rules={[{ required: true, message: "Es necesario costo" }]}
                  >
                    <TextField
                      size="small"
                      type={"number"}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      placeholder="Valor"
                    />
                  </Form.Item>
                </Grid>
              </Grid>
            ))}
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
  );
};
