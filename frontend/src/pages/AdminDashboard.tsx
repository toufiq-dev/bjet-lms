import Box from "@mui/material/Box";
import UserCreationModal from "../components/modals/UserCreationModal";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 150;

const AdminDashboard = () => {
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
        <UserCreationModal />
      </Box>
    </Box>
  );
};

export default AdminDashboard;