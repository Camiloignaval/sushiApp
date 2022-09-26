import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSendMessageMutation } from "../../store/RTKQuery/wspApi";
import { WhatsappOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: { phone: string; name: string };
}

export const MessageModal: React.FC<Props> = ({ open, setOpen, user }) => {
  const [message, setMessage] = React.useState("");
  const [sendMessageQuery] = useSendMessageMutation();

  const sendMessage = async () => {
    try {
      sendMessageQuery({ phone: user.phone, message }).unwrap;
      setOpen(false);
      setMessage("");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Box display={"flex"} alignItems="center">
            <WhatsappOutlined color="success" sx={{ mr: 2 }} />
            Envia un mensaje a {user.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Mensaje"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button disabled={message === ""} onClick={sendMessage}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
