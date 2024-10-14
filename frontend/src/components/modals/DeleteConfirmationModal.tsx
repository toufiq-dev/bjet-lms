import React from 'react';
import { Modal, Box, Button, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
};

const DeleteConfirmationModal: React.FC<Props> = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: "white", margin: "10% auto", width: 400, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>{title}</Typography>
                <Typography mb={2}>{message}</Typography>
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="secondary"
                        sx={{
                            borderColor: 'gray',
                            color: 'gray',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                borderColor: 'gray',
                                color: 'gray',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        color="error" // Change the color to "error" for a red button
                        startIcon={<DeleteIcon />}
                        sx={{ marginLeft: 2 }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteConfirmationModal;
