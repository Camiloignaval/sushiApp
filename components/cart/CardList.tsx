import {
  Grid,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import NextLink from "next/link";
import { FC, useEffect, useState } from "react";
import { FullScreenLoading, ItemCounter } from "../ui";
import { IProduct } from "../../interfaces/products";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ICartProduct, IOrderItem } from "../../interfaces";
import {
  removeFromCart,
  // udpateCartQuantity,
} from "../../store/Slices/CartSlice";
import { currency } from "../../utils";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { TextSnippetOutlined } from "@mui/icons-material";

interface Props {
  editable?: boolean;
  orderProduct?: IOrderItem[] | boolean;
  id?: string;
}
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export const CardList: FC<Props> = ({
  editable = false,
  orderProduct = false,
  id = undefined,
}) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.cart);
  const [noteOpen, setNoteOpen] = useState(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const handleDelete = (product: ICartProduct) => {
    dispatch(removeFromCart(product._id ?? ""));
  };

  return (
    <>
      {!cart ? (
        <FullScreenLoading />
      ) : (
        (orderProduct ? (orderProduct as ICartProduct[]) : cart).map(
          (product, i) => (
            <Box key={i}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3} marginBottom={2} key={i}>
                <Grid item xs={3}>
                  <CardActionArea>
                    <CardMedia
                      image={product.image.toString()}
                      component="img"
                      sx={{ borderRadius: "5px" }}
                    />
                  </CardActionArea>
                </Grid>
                <Grid item xs={7}>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">
                      <>
                        {product.name} ({product.quantity}{" "}
                        {product.quantity === 1 ? "unidad" : "unidades"})
                      </>
                    </Typography>
                    <Typography variant="body1">
                      {product.name === "Roll personalizado" && (
                        <Box>
                          <Typography variant="subtitle2" marginBottom={-1}>
                            Envoltura
                          </Typography>
                          <Grid
                            container
                            style={{ margin: "0", display: "flex" }}
                          >
                            {product.envelopes!.map((env, i) => (
                              <Grid
                                key={i}
                                item
                                style={{ margin: "0 30px 0 0" }}
                              >
                                <Typography variant="caption">
                                  <VscDebugBreakpointLog
                                    style={{ position: "relative", top: 2 }}
                                  />{" "}
                                  {env.name}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                          <Typography variant="subtitle2" marginBottom={-1}>
                            Relleno
                          </Typography>
                          <Grid
                            container
                            style={{ margin: "0", display: "flex" }}
                          >
                            {[
                              ...product.proteins!,
                              ...product.vegetables!,
                            ]!.map((env, i) => (
                              <Grid
                                key={i}
                                item
                                style={{ margin: "0 30px 0 0" }}
                              >
                                <Typography variant="caption">
                                  <VscDebugBreakpointLog
                                    style={{ position: "relative", top: 2 }}
                                  />
                                  {env.qty! ?? 1} {env.name}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                          <Typography variant="subtitle2" marginBottom={-1}>
                            Salsas
                          </Typography>
                          <Grid
                            container
                            style={{ margin: "0", display: "flex" }}
                          >
                            {(product.sauces! as IProduct[]).map((env, i) => (
                              <Grid
                                key={i}
                                item
                                style={{ margin: "0 30px 0 0" }}
                              >
                                <Typography variant="caption">
                                  <VscDebugBreakpointLog
                                    style={{ position: "relative", top: 2 }}
                                  />
                                  {env.qty! ?? 1} {env.name}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                          {product.extraProduct!.length > 0 && (
                            <>
                              <Typography variant="subtitle2" marginBottom={-1}>
                                Extras
                              </Typography>
                              <Grid
                                container
                                style={{ margin: "0", display: "flex" }}
                              >
                                {[...product.extraProduct!]!.map((env, i) => (
                                  <Grid
                                    key={i}
                                    item
                                    style={{ margin: "0 30px 0 0" }}
                                  >
                                    <Typography variant="caption">
                                      <VscDebugBreakpointLog
                                        style={{ position: "relative", top: 2 }}
                                      />{" "}
                                      {env.qty! ?? 1} {env.name}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </>
                          )}
                        </Box>
                      )}
                    </Typography>
                    <Typography variant="body1">
                      {product.name !== "Roll personalizado" &&
                        (product?.sauces! ?? []).length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" marginBottom={-1}>
                              Salsas
                            </Typography>
                            <Grid
                              container
                              style={{ margin: "0", display: "flex" }}
                            >
                              {product?.sauces!!.map((s, i) => (
                                <Grid
                                  key={i}
                                  item
                                  style={{ margin: "0 30px 0 0" }}
                                >
                                  <Typography variant="caption">
                                    <>
                                      <VscDebugBreakpointLog
                                        style={{
                                          position: "relative",
                                          top: 2,
                                          marginRight: 2,
                                        }}
                                      />
                                      {s.qty! ?? 1} {s.name}
                                    </>
                                  </Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={2}
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                >
                  <Typography variant="subtitle1">
                    {currency.format(+product.price)} <small>c/u</small>
                  </Typography>

                  {(editable || isLoggedIn) && (
                    <>
                      {editable && (
                        <Button
                          onClick={() => handleDelete(product as ICartProduct)}
                          variant="text"
                          color="secondary"
                        >
                          Eliminar
                        </Button>
                      )}
                      {/* notas especiales */}
                      {product.note && (
                        <>
                          <HtmlTooltip
                            title={
                              <>
                                <Typography color="inherit">
                                  Notas especiales
                                </Typography>
                                {product.note}
                              </>
                            }
                            placement="left-start"
                          >
                            <IconButton
                              onClick={() => setNoteOpen(true)}
                              aria-label="delete"
                            >
                              <TextSnippetOutlined />
                            </IconButton>
                          </HtmlTooltip>
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )
        )
      )}
    </>
  );
};
