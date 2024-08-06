import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton, Select, MenuItem, TextField, Button, SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
    width: 600,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
    overflow: "auto",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 2,
};

interface LessonCreationModalProps {
    open: boolean;
    onClose: () => void;
}

const LessonCreationModal: React.FC<LessonCreationModalProps> = ({ open, onClose }) => {
    const [type, setType] = useState('Lesson');
    const [name, setName] = useState('');

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        setType(event.target.value as string);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{
                onClick: (event) => event.stopPropagation(),
            }}
        >
            <Box sx={style}>
                <Box sx={headerStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add New {type}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    <Typography variant="body1" gutterBottom>
                        Select Type:
                    </Typography>
                    <Select
                        value={type}
                        onChange={handleTypeChange}
                        fullWidth
                        displayEmpty
                    >
                        <MenuItem value="Lesson">Lesson</MenuItem>
                        <MenuItem value="Assignment">Assignment</MenuItem>
                        <MenuItem value="Quiz">Quiz</MenuItem>
                    </Select>
                    <Box mt={2}>
                        <Typography variant="body1" gutterBottom>
                            Name:
                        </Typography>
                        <TextField
                            value={name}
                            onChange={handleNameChange}
                            fullWidth
                            placeholder={`Enter ${type} name`}
                        />
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body1" gutterBottom>
                            Upload File:
                        </Typography>
                        <input type="file" />
                    </Box>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={onClose}>
                            Add Item
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default LessonCreationModal;
