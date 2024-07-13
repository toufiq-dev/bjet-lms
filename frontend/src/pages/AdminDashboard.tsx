import React, { useState } from "react";
import SignOutButton from "../components/buttons/SignOutButton";
import UserCreationModal from "../components/modals/UserCreationModal";

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
    <>
      <SignOutButton />
      <UserCreationModal
        open={modalOpen}
        onClose={handleCloseModal}
        userType={userType}
      />
      {/* Example buttons to trigger modals */}
      <button onClick={handleStudentCreation}>Create Student</button>
      <button onClick={handleTeacherCreation}>Create Teacher</button>
    </>
  );
};

export default AdminDashboard;
