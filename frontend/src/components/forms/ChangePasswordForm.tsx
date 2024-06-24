import React, { useState } from "react";
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

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ oldPassword: "", newPassword: "" });

    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validatePasswords = () => {
        const newErrors = { oldPassword: "", newPassword: "" };

        oldPassword ? null : newErrors.oldPassword = "This field cannot be empty.";
        newPassword ? null : newErrors.newPassword = "This field cannot be empty.";
        if (newErrors.oldPassword || newErrors.newPassword) {
            setErrors(newErrors);
            return false;
        }

        oldPassword === newPassword
            ? newErrors.oldPassword = "Old password and new password cannot be the same."
            : null;

        if (newPassword.length < 8 || newPassword.length > 20) {
            newErrors.newPassword = "Password must contain at least 8 characters and at most 20 characters.";
            setErrors(newErrors);
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        !passwordRegex.test(newPassword)
            ? newErrors.newPassword = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
            : null;

        setErrors(newErrors);
        return !(newErrors.oldPassword || newErrors.newPassword);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validatePasswords()) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            console.log("Password changed successfully");
        }, 2000);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Change Password
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="old-password"
                        label="Old Password"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        error={Boolean(errors.oldPassword)}
                        helperText={errors.oldPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle old password visibility"
                                        onClick={handleClickShowOldPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="new-password"
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={Boolean(errors.newPassword)}
                        helperText={errors.newPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle new password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Change Password"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ChangePasswordForm;
