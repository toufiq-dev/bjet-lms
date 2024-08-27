import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import useCourse from "../hooks/useCourse";
import { useEffect, useState } from "react";
import LessonModuleTestButton from "../components/buttons/LessonModuleTestButton";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";
import CourseNavigations from "../components/navigations/CourseNavigations";

const drawerWidth = 150;

const CourseHomePage = () => {
  const { id } = useParams();
  const { getCourseById } = useCourse();
  const role = useSelector((state: IState) => state.user.role);
  const [response, setResponse] = useState({
    success: false,
    message: "",
    data: {
      title: "",
    },
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          <Box>{role === "Teacher" && <LessonModuleTestButton />}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseHomePage;
