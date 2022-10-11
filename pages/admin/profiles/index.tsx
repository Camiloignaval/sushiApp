import {
  AddOutlined,
  MessageOutlined,
  PeopleOutline,
  WhatsApp,
} from "@mui/icons-material";
import { Box, Button, Grid, IconButton, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import esLocale from "date-fns/locale/es";
import { AdminLayout } from "../../../components/layouts";
import { FullScreenLoading } from "../../../components/ui";
import { useSendDirectMessage } from "../../../hooks";
import { IUser } from "../../../interfaces";
import { useGetAdminsQuery } from "../../../store/RTKQuery/adminApi";

const ProfilesPage = () => {
  const { data: dataUsers } = useGetAdminsQuery(null);

  console.log({ dataUsers });

  const [MessageModal, setuserActiveToWsp, setOpen] = useSendDirectMessage();

  const columns: GridColDef[] = [
    { field: "name", flex: 1, headerName: "Nombre", minWidth: 200 },
    { field: "userName", flex: 1, headerName: "Nombre Usuario", minWidth: 200 },
    { field: "phone", flex: 1, headerName: "Teléfono", minWidth: 200 },
    { field: "pass", flex: 1, headerName: "Nueva contraseña", minWidth: 150 },
  ];

  if (!dataUsers) return <FullScreenLoading />;

  const rows = dataUsers!.map((user: IUser) => ({
    id: user?._id,
    name: user?.name,
    role: user?.role,
    phone: user?.phone,
    userName: user?.userName,
  }));

  return (
    <AdminLayout
      icon={<PeopleOutline />}
      title={"Administradores"}
      subTitle={"Mantenimiento de perfiles"}
    >
      <Box display={"flex"} justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/profiles/new"
        >
          Nuevo usuario
        </Button>
      </Box>
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

export default ProfilesPage;
