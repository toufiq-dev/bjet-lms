import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";
import CourseList from "../components/cards/CourseList";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const drawerWidth = 150;

const UserDashboard = () => {
  const role = useSelector((state: IState) => state.user.role);

  return (
    <Box display="flex">
      <ResponsiveDrawer drawerItemIndex={1} />
      <Box
        component="main"
        sx={{
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ float: "right" }}>
          {role === "Teacher" && (
            <Link to="/create-course">
              <Button variant="contained">Create a Course</Button>
            </Link>
          )}
        </Box>
        <CourseList />
      </Box>
    </Box>
  );
};

export default UserDashboard;
