import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import CourseCreationForm from "../components/forms/CourseCreationForm";

const drawerWidth = 150;

const CreateCoursePage = () => {
  return (
    <Box display="flex">
      <ResponsiveDrawer drawerItemIndex={2} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <CourseCreationForm />
      </Box>
    </Box>
  );
};

export default CreateCoursePage;
