import React, { useState, useRef } from "react";
import { TextField, Chip, Box, Typography } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

interface BulkUserInputProps {
    emails: string[];
    setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

const BulkUserInput: React.FC<BulkUserInputProps> = ({ emails, setEmails }) => {
    const [emailInput, setEmailInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    interface FormData {
        email: string;
    }

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const handleAddEmail = (data: { email: string }) => {
        const newEmail = data.email.trim();
        if (newEmail !== "" && !emails.includes(newEmail)) {
            setEmails([...emails, newEmail]);
            setEmailInput("");
            reset(); // Reset the form
        }
    };

    const handleDeleteEmail = (emailToDelete: string) => {
        setEmails(emails.filter((email) => email !== emailToDelete));
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === "," || event.key === " ") {
            event.preventDefault();
            handleSubmit(handleAddEmail)(); // Trigger form submission
            if (inputRef.current) {
                setTimeout(() => {
                    inputRef.current?.focus();
                    inputRef.current?.setSelectionRange(emailInput.length, emailInput.length);
                }, 0);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: 1,
                mb: 3,
                width: 800,
                position: 'relative',
                cursor: 'text' // Ensures the cursor changes to text input cursor when hovering
            }}
            onClick={() => inputRef.current?.focus()} // Focus the input when clicking anywhere in the box
        >
            {emails.map((email, index) => (
                <Chip
                    key={index}
                    label={email}
                    onDelete={() => handleDeleteEmail(email)}
                    deleteIcon={<Cancel />}
                    sx={{ m: 0.5 }}
                />
            ))}
            <form onSubmit={handleSubmit(handleAddEmail)} style={{ flex: 1 }}>
                <Controller
                    name="email"
                    control={control}
                    defaultValue={emailInput}
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email format",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value);
                                field.onChange(e);
                            }}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            inputRef={inputRef}
                            InputProps={{
                                style: {
                                    flex: 1, // Take up remaining space
                                    minWidth: 0, // Allow shrinking
                                    border: 'none',
                                    padding: 0,
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                            }}
                            error={!!errors.email}
                        />
                    )}
                />
            </form>
            {errors.email && (
                <Typography
                    color="error"
                    variant="body2"
                    sx={{
                        position: 'absolute',
                        bottom: -24,
                        left: 16,
                    }}
                >
                    {errors.email.message}
                </Typography>
            )}
        </Box>
    );
};

export default BulkUserInput;
