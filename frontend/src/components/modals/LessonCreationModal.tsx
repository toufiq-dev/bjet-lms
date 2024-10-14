import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton, /* Select, MenuItem, */ TextField, Button /*, SelectChangeEvent */ } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import useLesson from '../../hooks/useLesson';

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
    onLessonCreate: () => void;  // New prop for re-fetching lessons after creation
    moduleId: string; // Pass the module ID for lesson creation
}

const LessonCreationModal: React.FC<LessonCreationModalProps> = ({ open, onClose, onLessonCreate, moduleId }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { createLesson } = useLesson(); // Use lesson creation API

    // const [type, setType] = useState('Lesson');
    // const handleTypeChange = (event: SelectChangeEvent<string>) => {
    //     setType(event.target.value as string);
    // };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleAddItem = async () => {
        if (!name || !file) return; // Validate inputs

        const formData = new FormData();
        formData.append("title", name);
        formData.append("moduleId", moduleId); // Include moduleId
        formData.append("content", file);

        const result = await createLesson(formData);

        if (result.success) {
            onLessonCreate(); // Re-fetch lessons after successful creation
            onClose(); // Close modal
        } else {
            console.error("Lesson creation failed:", result.message);
        }
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
                        Add New Lesson
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    {/* <Typography variant="body1" gutterBottom>
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
                    </Select> */}
                    <Box mt={2}>
                        <Typography variant="body1" gutterBottom>
                            Name:
                        </Typography>
                        <TextField
                            value={name}
                            onChange={handleNameChange}
                            fullWidth
                            placeholder="Enter Lesson name"
                        />
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body1" gutterBottom>
                            Upload File:
                        </Typography>
                        <input type="file" onChange={handleFileChange} />
                    </Box>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleAddItem}>
                            {/* Add Item */}
                            Add Lesson
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default LessonCreationModal;
