import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import CustomAlert from "../alerts/CustomAlert";
//import { useDispatch } from "react-redux";
//import { saveSignIn } from "../../redux/slices/userSlice";
//import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios"; // Import Axios with AxiosError for error handling

interface FormData {
  email: string;
}

interface ApiResponse {
  message: string;
}

const ForgotPasswordForm = () => {
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [apiMessage, setApiMessage] = useState<string>("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  //const dispatch = useDispatch();
  //const navigate = useNavigate();

  const sendResetEmail = async (formData: FormData) => {
    try {
      setShowCircularProgress(true);
      const response = await axios.post<ApiResponse>(
        "YOUR_API_ENDPOINT_HERE",
        formData
      );
      setShowCircularProgress(false);
      setApiMessage(response.data.message); // Assuming API returns a message
      setOpenAlert(true);
      reset(); // Reset form fields after successful submission
    } catch (error) {
      setShowCircularProgress(false);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
          setApiMessage(
            axiosError.response.data.message || "Failed to send email."
          );
        } else {
          setApiMessage(axiosError.message || "Failed to send email.");
        }
      } else {
        setApiMessage("Failed to send email.");
      }
      setOpenAlert(true);
    }
  };

  const handlerOnSubmit = async () => {
    const formData = {
      email: getValues("email"),
    };
    await sendResetEmail(formData);
  };

  return (
    <Box bgcolor="#ECEFF1" height="100vh" pt={16}>
      <Container component="main" maxWidth="xs">
        {openAlert && (
          <CustomAlert
            open={openAlert}
            onClose={() => setOpenAlert(false)}
            severity={apiMessage.includes("Success") ? "success" : "error"}
            message={apiMessage}
          />
        )}
        <Paper
          elevation={0}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ marginTop: 2 }}>
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(handlerOnSubmit)}
            sx={{ mt: 1 }}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={errors.email ? errors.email.message : "Email"}
                  autoComplete="email"
                  autoFocus
                  {...field}
                  error={!!errors.email}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={showCircularProgress}
            >
              {showCircularProgress ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordForm;
