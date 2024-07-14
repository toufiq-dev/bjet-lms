import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";

const drawerWidth = 150;

const UserDashboard = () => {
  return (
    <Box display="flex">
      <ResponsiveDrawer title="Dashboard" drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
};

export default UserDashboard;
