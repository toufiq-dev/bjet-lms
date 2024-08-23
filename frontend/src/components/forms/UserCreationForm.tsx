import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import CustomAlert from "../alerts/CustomAlert";
import useUser from "../../hooks/useUser";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const UserCreationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    success: true,
    message: "",
  });

  const { createTeachers } = useUser();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Teacher",
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlerOnSubmit = async (data: FormData) => {
    setShowCircularProgress(true);

    try {
      const response = await createTeachers({
        email: data.email,
        password: data.password,
        role: data.role,
      });
      if (response.error) {
        throw new Error(response.error.message || response.error);
      }

      setAlertData({
        success: true,
        message: "Teacher registered successfully",
      });
    } catch (error) {
      setAlertData({ success: false, message: (error as Error).message });
    } finally {
      setShowCircularProgress(false);
      setOpenAlert(true);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container component="main" maxWidth="xs">
      {openAlert && (
        <CustomAlert
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          severity={alertData.success ? "success" : "error"}
          message={alertData.message}
        />
      )}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? 2 : 0,
        }}
      >
        <Typography component="h1" variant="h4" align="center">
          Teacher Registration
        </Typography>
        <Paper
          elevation={0}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: isMobile ? 2 : 4,
            marginTop: 2,
            width: "100%",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(handlerOnSubmit)}
            sx={{ mt: 1 }}
          >
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label={errors.name ? errors.name.message : "Name"}
                  autoFocus
                  {...field}
                  error={!!errors.name}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                maxLength: {
                  value: 100,
                  message: "Email cannot exceed 100 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
                  {...field}
                  error={!!errors.email}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must contain at least 8 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[A-Za-z\d~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,}$/,
                  message:
                    "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol",
                },
              }}
              render={({ field }) => (
                <TextField
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label={
                    errors.password ? "Invalid password format" : "Password"
                  }
                  helperText={errors.password && errors.password.message}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...field}
                  error={!!errors.password}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 4, mb: 2 }}
            >
              {showCircularProgress ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                "Register"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserCreationForm;
