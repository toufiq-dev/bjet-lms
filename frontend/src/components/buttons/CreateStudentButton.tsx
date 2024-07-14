import { useState } from "react";
import Button from "@mui/material/Button";
import UserCreationModal from "../modals/UserCreationModal";

const CreateStudentButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen} sx={{ mr: 2 }}>
                Create Student
            </Button>
            <UserCreationModal
                open={modalOpen}
                onClose={handleClose}
                userType="student"
            />
        </>
    );
};

export default CreateStudentButton;
