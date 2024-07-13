import React, { useState } from "react";
import { TextField, Chip } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface BulkUserInputProps {
    emails: string[];
    setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

const BulkUserInput: React.FC<BulkUserInputProps> = ({ emails, setEmails }) => {
    const [emailInput, setEmailInput] = useState("");

    const handleAddEmail = () => {
        if (emailInput.trim() !== "" && !emails.includes(emailInput)) {
            setEmails([...emails, emailInput.trim()]);
            setEmailInput("");
        }
    };

    const handleDeleteEmail = (emailToDelete: string) => {
        setEmails(emails.filter((email) => email !== emailToDelete));
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            handleAddEmail();
        } else if (event.key === " ") {
            event.preventDefault();
            handleAddEmail();
            setEmailInput(""); // Clear input after adding email
        }
    };

    const handleBlur = () => {
        handleAddEmail();
    };

    return (
        <TextField
            label="Add email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            fullWidth
            variant="outlined"
            InputProps={{
                startAdornment: emails.map((email, index) => (
                    <Chip
                        key={index}
                        label={email}
                        onDelete={() => handleDeleteEmail(email)}
                        deleteIcon={<Cancel />}
                        sx={{ m: 0.5 }}
                    />
                )),
                style: { display: "flex", flexWrap: "wrap", gap: 6 },
                inputProps: {
                    style: { minWidth: 50 }, // Adjust minimum width to prevent wrapping
                },
            }}
            InputLabelProps={{
                shrink: true,
            }}
            sx={{
                mb: 3,
            }}
        />
    );
};

export default BulkUserInput;
