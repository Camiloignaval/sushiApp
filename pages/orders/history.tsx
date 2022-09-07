import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layouts";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre Completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagada",
    description: "Muestra info si la orden ha sido pagada",
    width: 150,
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.paid ? (
        <Chip
          label="Pagada"
          color="success"
          variant="outlined"
          sx={{ width: "100%" }}
        />
      ) : (
        <Chip
          label="Pendiente"
          color="error"
          variant="outlined"
          sx={{ width: "100%" }}
        />
      );
    },
  },
  {
    field: "orderLink",
    headerName: "Ver orden",
    width: 100,
    sortable: false,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${row.orderId}`} passHref>
          <Link underline="always">Ver detalle</Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows: any[] = orders.map((o, i) => ({
    id: i + 1,
    paid: o.isPaid,
    fullname: o.shippingAddress.firstName + " " + o.shippingAddress.lastName,
    orderId: o._id,
  }));

  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
      <Grid className="fadeIn" container xs={12} height={650} width="100%">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
        ></DataGrid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=orders/history`,
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session?.user?._id);

  if (!orders) {
    return {
      redirect: {
        destination: `/auth/login?p=orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
