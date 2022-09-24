import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { FullScreenLoading } from "../../components/ui";
import { IUser } from "../../interfaces";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../store/RTKQuery/adminApi";

const UsersPage = () => {
  const { data: dataUsers } = useGetUsersQuery(null);
  const [updateRol] = useUpdateUserRoleMutation();

  const onRoleUpdated = (userId: string, role: string) => {
    updateRol({ userId, role });
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            sx={{ width: 300 }}
            onChange={(e) => onRoleUpdated(row.id, e.target.value)}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">Super usuario</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  if (!dataUsers) return <FullScreenLoading />;

  const rows = dataUsers!.map((user: IUser) => ({
    id: user?._id,
    name: user?.name,
    role: user?.role,
  }));

  return (
    <AdminLayout
      icon={<PeopleOutline />}
      title={"Usuarios"}
      subTitle={"Mantenimiento de usuarios"}
    >
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
