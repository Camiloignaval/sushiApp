import { InfoRounded } from "@mui/icons-material";
import { Box, Grid, Avatar, Typography, Button } from "@mui/material";
import { spacing, padding, color } from "@mui/system";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "../store/RTKQuery/productsApi";

interface PropsOnDelete {
  img: string;
  name: string;
  id: string;
}

export const useDeleteProduct = () => {
  const [deleteProductQuery, deleteProductStatus] = useDeleteProductMutation();
  const router = useRouter();
  const onConfirmDelete = async (idToast: string, idProducto: string) => {
    toast.dismiss(idToast);
    try {
      await deleteProductQuery(idProducto);
      router.push("/admin/products");
    } catch (error) {
      console.log({ error });
    }
  };

  const onDeleteProduct = (row: PropsOnDelete) => {
    toast.custom(
      (t) => (
        <Box>
          <Grid container spacing={2}>
            <Grid item>
              <Box>
                <Avatar alt="imgProducto" src={row.img} />
                <Avatar
                  sx={{
                    position: "absolute",
                    top: 0,
                    zIndex: 99,
                    opacity: 0.3,
                  }}
                  alt="Prohibido"
                  src="/images/prohibido.png"
                />
              </Box>
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

  return { onDeleteProduct, deleteProductStatus };
};
