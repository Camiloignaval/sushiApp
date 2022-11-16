import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  DeliveryDiningOutlined,
  DoDisturbAltOutlined,
  PlayArrowOutlined,
} from "@mui/icons-material";
import { IOrder } from "../../interfaces";
import { GridRowId } from "@mui/x-data-grid";
import { useEffect } from "react";
import { printOrder } from "../../utils/printOrder";
import {
  useAnulateOrdersMutation,
  useChangeOrderStatusMutation,
} from "../../store/RTKQuery/ordersApi";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
interface Props {
  data: IOrder[];
  rowsId: GridRowId[];
}
export const OrdersActions: React.FC<Props> = ({ data = [], rowsId = [] }) => {
  const [changeStatus, changeStatusState] = useChangeOrderStatusMutation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isAllIngested, setisAllIngested] = React.useState(false);
  const [isAllInProcess, setisAllInProcess] = React.useState(false);
  const [isAllDispatched, setisAllDispatched] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [anulateOrderQuery, anulateOrderStatus] = useAnulateOrdersMutation();
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    data.every((d) => d.status === "ingested")
      ? setisAllIngested(true)
      : setisAllIngested(false);
    data.every((d) => d.status === "inprocess")
      ? setisAllInProcess(true)
      : setisAllInProcess(false);
    data.every((d) => d.status === "dispatched")
      ? setisAllDispatched(true)
      : setisAllDispatched(false);
  }, [data]);

  const handleProcess = () => {
    changeStatus({ ids: rowsId, newStatus: "inprocess" });
    data.forEach((orden) => {
      printOrder(orden);
    });
    handleClose();
  };
  const handleDispatch = () => {
    changeStatus({ ids: rowsId, newStatus: "dispatched" });
    handleClose();
  };
  const handleDeliver = () => {
    changeStatus({ ids: rowsId, newStatus: "delivered" });

    handleClose();
  };

  const anulateOrder = async () => {
    try {
      await anulateOrderQuery(rowsId).unwrap();
      handleClose();
    } catch (error) {}
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        color="primary"
        sx={{ my: 1 }}
        disabled={rowsId.length === 0 || changeStatusState.isLoading}
      >
        Acciones
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          disabled={!isAllIngested}
          onClick={handleProcess}
          disableRipple
        >
          <PlayArrowOutlined />
          Procesar
        </MenuItem>
        <MenuItem
          disabled={!isAllInProcess}
          onClick={handleDispatch}
          disableRipple
        >
          <DeliveryDiningOutlined />
          Despachar
        </MenuItem>
        <MenuItem
          disabled={!isAllDispatched}
          onClick={handleDeliver}
          disableRipple
        >
          <DeliveryDiningOutlined />
          Entregadas
        </MenuItem>
        <MenuItem onClick={anulateOrder} disableRipple>
          <DoDisturbAltOutlined />
          Anular
        </MenuItem>
      </StyledMenu>
    </div>
  );
};
