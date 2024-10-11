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
import useModule from "../hooks/useModule";
import { Module } from "../interfaces/moduleInterface";
import ModuleList from "../components/accordions/ModuleList";

const drawerWidth = 150;

const CourseHomePage = () => {
  const { id } = useParams();
  const { getCourseById } = useCourse();
  const { getModulesByCourseId } = useModule();
  const role = useSelector((state: IState) => state.user.role);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    message: "",
    data: { title: "" },
  });
  const [modules, setModules] = useState<Module[]>([]);

  const getModulesFromApi = async () => {
    try {
      const result = await getModulesByCourseId(id as string);
      if (result.success) {
        setModules(result.data);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  useEffect(() => {
    const getCourseDetailsFromApi = async () => {
      try {
        const result = await getCourseById(id);
        setResponse(result);
      } catch (error) {
        console.error("Error setting data:", error);
      }
    };

    getCourseDetailsFromApi();
    getModulesFromApi();
  }, []);

  const toggleDrawer = (newOpen: boolean) => async () => {
    setOpen(newOpen);
  };

  const refetch = () => {
    getModulesFromApi(); // Re-fetch modules after one is created
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
        <Box sx={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            {role === "Teacher" && (
              <Button variant="contained" onClick={toggleDrawer(true)}>
                <AddIcon fontSize="small" sx={{ mr: 0.5 }} />
                Module
              </Button>
            )}
          </Box>

          <TemporaryDrawer
            open={open}
            toggleDrawer={() => setOpen(false)}
            title="Add Module"
            refetch={refetch}
          />

          <Box mt={4}>
            {modules.length > 0 ? (
              <ModuleList
                modules={modules}
                open={open}
                toggleDrawer={() => setOpen(false)}
                title="Edit Module"
                refetch={refetch}
              />
            ) : (
              <Box>No modules available yet</Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseHomePage;