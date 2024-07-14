import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import CreateCourseButton from "../components/buttons/CreateCourseButton";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";

const drawerWidth = 150;

const UserDashboard = () => {
  const role = useSelector((state: IState) => state.user.role);

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
        {role === "Teacher" && <CreateCourseButton />}
      </Box>
    </Box>
  );
};

export default UserDashboard;
