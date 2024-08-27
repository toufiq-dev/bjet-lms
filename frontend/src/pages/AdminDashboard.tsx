import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import CreateStudentButton from "../components/buttons/CreateStudentButton";
import CreateTeacherButton from "../components/buttons/CreateTeacherButton";

const drawerWidth = 150;

const AdminDashboard = () => {
  return (
    <Box display="flex">
      <ResponsiveDrawer drawerItemIndex={1} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <CreateStudentButton />
        <CreateTeacherButton />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
