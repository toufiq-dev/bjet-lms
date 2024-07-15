import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import Toolbar from "@mui/material/Toolbar";
import CreateCourseButton from "../components/buttons/CreateCourseButton";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";
import CourseCard from "../components/cards/CourseCard";
import { useEffect, useState } from "react";
import useCourse from "../hooks/useCourse";

const drawerWidth = 150;

const UserDashboard = () => {
  const role = useSelector((state: IState) => state.user.role);
  const id = useSelector((state: IState) => state.user.id);
  const { getAllByTeacherReference } = useCourse();
  const [response, setResponse] = useState({
    success: true,
    message: "",
    data: [
      {
        title: "",
      },
    ],
  });

  useEffect(() => {
    const getAllByTeacherReferencefromAPI = async () => {
      try {
        const result = await getAllByTeacherReference(id);
        setResponse(result);
      } catch (error) {
        console.error("Error setting data:", error);
      }
    };

    getAllByTeacherReferencefromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Box sx={{ float: "right", mr: 10 }}>
          {role === "Teacher" && <CreateCourseButton />}
        </Box>
        <Box mt={10} display="flex" gap={5}>
          {response.data.map((course, index) => (
            <CourseCard key={index} title={course.title} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
