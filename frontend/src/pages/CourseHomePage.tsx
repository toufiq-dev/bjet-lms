import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import useCourse from "../hooks/useCourse";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";
import CourseNavigations from "../components/navigations/CourseNavigations";
import AddIcon from "@mui/icons-material/Add";
import TemporaryDrawer from "../components/drawers/TemporaryDrawer";
import Button from "@mui/material/Button";
import useModule from "../hooks/useModule"; // import the custom hook for modules
import { Module } from "../interfaces/moduleInterface"; // import the module interface

const drawerWidth = 150;

const CourseHomePage = () => {
  const { id } = useParams(); // Course ID
  const { getCourseById } = useCourse();
  const { getModulesByCourseId } = useModule(); // get modules by course
  const role = useSelector((state: IState) => state.user.role);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    message: "",
    data: { title: "" },
  });
  const [modules, setModules] = useState<Module[]>([]); // Annotate modules with the Module type

  // Fetch course details and modules
  useEffect(() => {
    const getCourseDetailsFromApi = async () => {
      try {
        const result = await getCourseById(id);
        setResponse(result);
      } catch (error) {
        console.error("Error setting data:", error);
      }
    };

    const getModulesFromApi = async () => {
      try {
        const result = await getModulesByCourseId(id as string);
        if (result.success) {
          setModules(result.data); // store modules in state
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    getCourseDetailsFromApi();
    getModulesFromApi();
  }, [id]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box display="flex">
      <ResponsiveDrawer
        breadcrumbs={
          response.success
            ? [
              { name: response.data.title, link: `/courses/${id}` },
              { name: "Modules", link: "" },
            ]
            : []
        }
        drawerItemIndex={2}
        menuItemIndex={0}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box display="flex" justifyContent="space-between">
          <CourseNavigations menuItemIndex={0} />
          <Box mr={3}>
            {role === "Teacher" && (
              <Button variant="contained" onClick={toggleDrawer(true)}>
                <AddIcon fontSize="small" sx={{ mr: 0.5 }} />
                Module
              </Button>
            )}
            <TemporaryDrawer
              open={open}
              toggleDrawer={() => setOpen(false)}
              title="Add Module"
            />
          </Box>
        </Box>
        {/* Display modules */}
        <Box mt={4}>
          {modules.length > 0 ? (
            modules.map((module) => (
              <Box
                key={module._id}
                p={2}
                mb={2}
                border="1px solid #ccc"
                borderRadius={4}
              >
                <h3>{module.title}</h3>
                <p>Order: {module.order}</p>
                <p>Lock Until: {new Date(module.lockUntil).toLocaleString()}</p>
                <p>Published: {module.isPublished ? "Yes" : "No"}</p>
              </Box>
            ))
          ) : (
            <p>No modules available</p>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseHomePage;
