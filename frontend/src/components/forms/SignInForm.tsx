import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import useUser from "../../hooks/useUser";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import CustomAlert from "../alerts/CustomAlert";
import { useDispatch } from "react-redux";
import { saveSignIn } from "../../redux/slices/userSlice";
import { useNavigate, Link } from "react-router-dom";

const SignInForm = () => {
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [data, setData] = useState({
    success: true,
    message: "",
    data: {},
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerOnSubmit = async () => {
    setShowCircularProgress(true);
    const formData = {
      email: getValues("email"),
      password: getValues("password"),
    };

    const result = await signIn(formData);
    setShowCircularProgress(false);
    if (result.error) {
      setData(result.error.response.data);
      setOpenAlert(true);
    } else {
      dispatch(saveSignIn(result.data));
      result.data.role === "Admin" ? navigate("/admin") : navigate("/");
    }
  };

  return (
    <Box bgcolor="#ECEFF1" height="100vh" pt={16}>
      <Container component="main" maxWidth="xs">
        {openAlert && (
          <CustomAlert
            open={openAlert}
            onClose={() => setOpenAlert(false)}
            severity="error"
            message={data.message}
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
          <img
            src="https://bjet-lms.s3.ap-south-1.amazonaws.com/decoration/bjet-logo.webp"
            alt="B-JET Logo"
            width={80}
          />
          <Typography component="h1" variant="h4" sx={{ marginTop: 2 }}>
            Sign in
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
                maxLength: {
                  value: 320,
                  message: "Invalid email format",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/,
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
                  error={errors.email ? true : false}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: {
                  value: 8,
                  message: "Password must contain at least 8 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Character limit exceeded",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[A-Za-z\d~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/,
                  message:
                    "Password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol",
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
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => e.preventDefault()}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...field}
                  error={errors.password ? true : false}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              {showCircularProgress === true ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                <>Sign In</>
              )}
            </Button>
            <Link
              to="/forgot-password"
              style={{ color: "#1565C0", textDecoration: "none" }}
            >
              Forgot password?
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInForm;
