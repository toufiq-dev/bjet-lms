import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type Props = {
  open: boolean;
  onClose: () => void;
  severity: "error" | "info" | "success" | "warning";
  message: string;
};

const CustomAlert = (props: Props) => {
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    props.onClose();
  };

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={props.severity}
        variant="filled"
        onClose={handleClose}
        sx={{ mb: 2 }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
