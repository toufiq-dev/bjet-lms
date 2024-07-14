import { useState } from "react";
import Button from "@mui/material/Button";
import UserCreationModal from "../modals/UserCreationModal";

const CreateTeacherButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Create Teacher
            </Button>
            <UserCreationModal
                open={modalOpen}
                onClose={handleClose}
                userType="teacher"
            />
        </>
    );
};

export default CreateTeacherButton;
