import React, { useState, useRef } from "react";
import { TextField, Chip, Box } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface BulkUserInputProps {
    emails: string[];
    setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

const BulkUserInput: React.FC<BulkUserInputProps> = ({ emails, setEmails }) => {
    const [emailInput, setEmailInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddEmail = () => {
        if (emailInput.trim() !== "" && !emails.includes(emailInput)) {
            setEmails([...emails, emailInput.trim()]);
            setEmailInput("");
        }
    };

    const handleDeleteEmail = (emailToDelete: string) => {
        setEmails(emails.filter((email) => email !== emailToDelete));
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === "," || event.key === " ") {
            event.preventDefault();
            handleAddEmail();
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
                width: 800
            }}
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
            <TextField
                label="Add email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
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
            />
        </Box>
    );
};

export default BulkUserInput;
