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
    Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import useUser from "../../hooks/useUser";
import CustomAlert from "../alerts/CustomAlert";

const ChangePasswordForm = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCircularProgress, setShowCircularProgress] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertData, setAlertData] = useState({
        success: true,
        message: "",
    });
    const [isChangePasswordChecked, setIsChangePasswordChecked] = useState(false);

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

    const { changePassword } = useUser();

    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChangePasswordChecked(event.target.checked);
    };

    const handlerOnSubmit = async () => {
        setShowCircularProgress(true);
        const formData = {
            oldPassword: getValues("oldPassword"),
            newPassword: getValues("newPassword"),
        };

        const result = await changePassword(formData);
        setShowCircularProgress(false);
        setAlertData(result.error ? { success: false, message: result.error.response.data.message } : { success: true, message: "Password changed successfully" });
        setOpenAlert(true);
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
                    marginTop: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h6">
                    <Box component="span" fontWeight="fontWeightBold">
                        Password:
                    </Box>
                    <Checkbox
                        checked={isChangePasswordChecked}
                        onChange={handleCheckboxChange}
                        size="small"
                    />
                    Change Password
                </Typography>
                {isChangePasswordChecked && (
                    <Box
                        component="form"
                        onSubmit={handleSubmit(handlerOnSubmit)}
                        sx={{ mt: 2, width: '100%', maxWidth: 250 }}
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
                                    size="small"
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
                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[A-Za-z\d~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,}$/,
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
                                    size="small"
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
                            size="small"
                            sx={{ mt: 2, mb: 1 }}
                        >
                            {showCircularProgress ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default ChangePasswordForm;
