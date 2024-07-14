import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import UserCreationModal from "../components/modals/UserCreationModal";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import SignOutButton from "../components/buttons/SignOutButton";

const drawerWidth = 150;

const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userType, setUserType] = useState<"student" | "teacher">("student"); // Default to student

  const handleStudentCreation = () => {
    setModalOpen(true);
    setUserType("student");
  };

  const handleTeacherCreation = () => {
    setModalOpen(true);
    setUserType("teacher");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box display="flex">
      <ResponsiveDrawer title="Dashboard" drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <SignOutButton />
        <UserCreationModal
          open={modalOpen}
          onClose={handleCloseModal}
          userType={userType}
        />
        <Button variant="contained" onClick={handleStudentCreation} sx={{ mr: 2 }}>
          Create Student
        </Button>
        <Button variant="contained" onClick={handleTeacherCreation}>
          Create Teacher
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
