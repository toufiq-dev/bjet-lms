import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Modal,
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import UserCreationForm from "../forms/UserCreationForm";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2
};

const UserCreationModal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <Button variant="contained" onClick={handleOpen}>
                Create User
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    onClick: (event) => event.stopPropagation()
                }}
            >
                <Box sx={style}>
                    <Box sx={headerStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create User
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <UserCreationForm />
                </Box>
            </Modal>
        </Box>
    );
};

export default UserCreationModal;
