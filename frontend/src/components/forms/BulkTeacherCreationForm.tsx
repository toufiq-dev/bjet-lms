import { useState } from "react";
import {
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Typography,
    Container,
    CircularProgress,
    Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import CustomAlert from "../alerts/CustomAlert";
import BulkUserInput from "../inputs/BulkUserInput";

const BulkTeacherCreationForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showCircularProgress, setShowCircularProgress] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertData, setAlertData] = useState({
        success: true,
        message: "",
    });
    const [emails, setEmails] = useState<string[]>([]);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            password: "",
        },
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handlerOnSubmit = async () => {
        setShowCircularProgress(true);

        setTimeout(() => {
            setShowCircularProgress(false);
            setAlertData({ success: true, message: "Teachers created successfully" });
            setOpenAlert(true);
        }, 2000);
    };

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
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h4">
                    Bulk Teacher Registration
                </Typography>
                <Paper
                    elevation={0}
                    square
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 4,
                        marginTop: 2,
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit(handlerOnSubmit)}
                        sx={{ mt: 1 }}
                    >
                        <BulkUserInput emails={emails} setEmails={setEmails} />
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
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {showCircularProgress ? (
                                <CircularProgress color="inherit" size={25} />
                            ) : (
                                "Create Teachers"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default BulkTeacherCreationForm;
