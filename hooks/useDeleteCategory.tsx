import { InfoRounded, QuestionMarkOutlined } from "@mui/icons-material";
import { Box, Grid, Avatar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDeleteCategoryMutation } from "../store/RTKQuery/categoriesApi";

interface PropsOnDelete {
  name: string;
  id: string;
}

export const useDeleteCategory = () => {
  const [deleteCategoryQuery, deleteCategoryStatus] =
    useDeleteCategoryMutation();
  const router = useRouter();

  const onConfirmDelete = async (idToast: string, idProducto: string) => {
    toast.dismiss(idToast);
    try {
      await deleteCategoryQuery(idProducto);
      router.push("/admin/categories");
    } catch (error) {
      console.log({ error });
    }
  };

  const onDeleteCategory = (row: PropsOnDelete) => {
    toast.custom(
      (t) => (
        <Box
          sx={{
            boxShadow: "4px 5px 15px -5px rgba(0,0,0,0.53)",
            p: 1,
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Avatar sx={{ bgcolor: "rgb(204, 242, 255)" }}>
                <QuestionMarkOutlined />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography>¿Seguro que desea eliminar {row.name}?</Typography>

              <Grid container spacing={1} padding={1}>
                <Grid item xs>
                  <Button
                    onClick={() => onConfirmDelete(t.id, row.id)}
                    fullWidth
                    color="primary"
                    variant="outlined"
                    size="small"
                  >
                    Eliminar
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    fullWidth
                    color="primary"
                    onClick={() => toast.dismiss(t.id)}
                    variant="outlined"
                    size="small"
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ),
      {
        // duration:50000
        icon: <InfoRounded sx={{ color: "#b3e6ff" }} />,
        duration: 30000,
      }
    );
  };

  return { onDeleteCategory, deleteCategoryStatus };
};
