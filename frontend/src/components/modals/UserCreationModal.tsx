import React from "react";
import { Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StudentCreationForm from "../forms/BulkStudentCreationForm";
import TeacherCreationForm from "../forms/BulkTeacherCreationForm";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90%",  // Adjusted to allow responsive resizing
  width: 800,
  maxHeight: "90vh",  // Limit modal height to 90% of viewport height
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: "none",
  overflow: "auto",  // Enable scrolling within modal if content exceeds height
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

interface UserCreationModalProps {
  open: boolean;
  onClose: () => void;
  userType: "student" | "teacher"; // Determines which form to render
}

const UserCreationModal: React.FC<UserCreationModalProps> = ({ open, onClose, userType }) => {
  const FormComponent = userType === "student" ? StudentCreationForm : TeacherCreationForm;
  const modalTitle = userType === "student" ? "Create Student" : "Create Teacher";

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
            {modalTitle}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ maxHeight: "calc(90vh - 100px)", overflowY: "auto" }}> {/* Adjusted maxHeight */}
          <FormComponent />
        </Box>
      </Box>
    </Modal>
  );
};

export default UserCreationModal;
