import { MessageOutlined, PeopleOutline, WhatsApp } from "@mui/icons-material";
import { Grid, IconButton, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { FullScreenLoading } from "../../components/ui";
import { IUser } from "../../interfaces";
import { useGetUsersQuery } from "../../store/RTKQuery/adminApi";
import esLocale from "date-fns/locale/es";
import { useSendDirectMessage } from "../../hooks";

const UsersPage = () => {
  const { data: dataUsers } = useGetUsersQuery(null);

  const [MessageModal, setuserActiveToWsp, setOpen] = useSendDirectMessage();
  const handleMessageWsp = (phone: string, name: string) => {
    setOpen(true);
    setuserActiveToWsp({ phone, name });
  };

  const columns: GridColDef[] = [
    { field: "name", flex: 1, headerName: "Nombre completo", minWidth: 200 },
    { field: "phone", flex: 1, headerName: "Nombre completo", minWidth: 150 },
    { field: "address", flex: 1, headerName: "Dirección", minWidth: 250 },
    {
      field: "createdAt",
      headerName: "Cliente desde",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }: GridValueGetterParams) => {
        return format(new Date(row.createdAt), "dd/MMMM/yyyy", {
          locale: esLocale,
        });
      },
    },
    {
      field: "wsp",
      headerName: "Msg",
      flex: 1,
      minWidth: 60,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <IconButton onClick={() => handleMessageWsp(row.phone, row.name)}>
            <WhatsApp color="success" />
          </IconButton>
        );
      },
    },
  ];

  if (!dataUsers) return <FullScreenLoading />;

  const rows = dataUsers!.map((user: IUser) => ({
    id: user?._id,
    name: user?.name,
    role: user?.role,
    phone: user?.phone,
    address: user?.address,
    createdAt: user?.createdAt,
  }));

  return (
    <AdminLayout
      icon={<PeopleOutline />}
      title={"Usuarios"}
      subTitle={"Mantenimiento de usuarios"}
    >
      <MessageModal />
      <Grid className="fadeIn" container xs={12} height={650} width="100%">
        <DataGrid
          rows={rows ?? []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
        ></DataGrid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
