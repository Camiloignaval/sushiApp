import { AddOutlined, PeopleOutline, WhatsApp } from "@mui/icons-material";
import { Box, Button, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React from "react";
import NextLink from "next/link";

import { AdminLayout } from "../../../components/layouts";
import { FullScreenLoading } from "../../../components/ui";
import { IUser } from "../../../interfaces";
import { useGetAdminsQuery } from "../../../store/RTKQuery/adminApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const ProfilesPage = () => {
  const { data: dataUsers } = useGetAdminsQuery(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const columns: GridColDef[] = [
    {
      field: "name",
      flex: 1,
      headerName: "Nombre",
      minWidth: 200,
      renderCell: ({ row }: GridValueGetterParams) => (
        <NextLink href={`/admin/profiles/${row.id}`} passHref>
          <Link underline="always">{row.name}</Link>
        </NextLink>
      ),
    },
    { field: "userName", flex: 1, headerName: "Nombre Usuario", minWidth: 200 },
    {
      field: "role",
      flex: 1,
      headerName: "Cargo",
      minWidth: 200,
      renderCell: ({ row }: GridValueGetterParams) => {
        return row.role === "admin"
          ? "Administrador"
          : row.role === "delivery"
          ? "Repartidor"
          : "SuperAdministrador";
      },
    },
    { field: "phone", flex: 1, headerName: "Teléfono", minWidth: 200 },
  ];

  if (!dataUsers) return <FullScreenLoading />;

  const rows = (
    user?.role === "superadmin"
      ? dataUsers
      : dataUsers.filter((u) => u.role !== "superadmin")
  )!.map((user: IUser) => ({
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
