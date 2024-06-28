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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

const ChangePasswordForm = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCircularProgress, setShowCircularProgress] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
    });

    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handlerOnSubmit = async () => {
        setShowCircularProgress(true);
        const formData = {
            oldPassword: getValues("oldPassword"),
            newPassword: getValues("newPassword"),
        };

        setTimeout(() => {
            setShowCircularProgress(false);
            console.log("Password changed successfully", formData);
        }, 2000);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h4">
                    Change Password
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(handlerOnSubmit)}
                    sx={{ mt: 1 }}
                >
                    <Controller
                        name="oldPassword"
                        control={control}
                        rules={{ required: "This field cannot be empty." }}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="old-password"
                                label={
                                    errors.oldPassword
                                        ? errors.oldPassword.message
                                        : "Old Password"
                                }
                                type={showOldPassword ? "text" : "password"}
                                {...field}
                                error={!!errors.oldPassword}
                                helperText={errors.oldPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle old password visibility"
                                                onClick={handleClickShowOldPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showOldPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                            required: "This field cannot be empty.",
                            minLength: {
                                value: 8,
                                message: "Password must contain at least 8 characters.",
                            },
                            maxLength: {
                                value: 20,
                                message: "Password must contain at most 20 characters.",
                            },
                            pattern: {
                                value: /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^(){}+=/_|-])/,
                                message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
                            },
                            validate: value =>
                                value !== getValues("oldPassword") || "New password must be different from the old password."
                        }}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="new-password"
                                label={
                                    errors.newPassword
                                        ? "Invalid password format"
                                        : "New Password"
                                }
                                type={showNewPassword ? "text" : "password"}
                                {...field}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle new password visibility"
                                                onClick={handleClickShowNewPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showNewPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {showCircularProgress ? (
                            <CircularProgress color="inherit" size={25} />
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ChangePasswordForm;