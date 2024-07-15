import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import useCourse from "../hooks/useCourse";
import { useEffect, useState } from "react";

const drawerWidth = 150;

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { getCourseById } = useCourse();
  const [response, setResponse] = useState({
    success: true,
    message: "",
    data: {
      title: "",
      description: "",
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
      <ResponsiveDrawer title={response.data.title} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {response.data.description}
      </Box>
    </Box>
  );
};

export default CourseDetailsPage;
