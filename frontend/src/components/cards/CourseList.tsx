import { useSelector } from "react-redux";
import IState from "../../interfaces/stateInterface";
import useCourse from "../../hooks/useCourse";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import CourseCard from "./CourseCard";

const CourseList = () => {
  const role = useSelector((state: IState) => state.user.role);
  const id = useSelector((state: IState) => state.user.id);

  const { getAll, getAllByTeacherReference } = useCourse();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    success: true,
    message: "",
    data: [
      {
        _id: "",
        title: "",
      },
    ],
  });

  useEffect(() => {
    const getAllfromAPI = async () => {
      try {
        setLoading(true);
        const result =
          role === "Teacher"
            ? await getAllByTeacherReference(id)
            : await getAll();
        setResponse(result);
      } catch (error) {
        console.error("Error setting data:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllfromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  return (
    <Grid container spacing={4} mt={10}>
      {loading === true
        ? Array.from({ length: 3 }).map((_, index) => (
            <Grid key={index}>
              <CourseCard loading />
            </Grid>
          ))
        : response.data.map((course, index) => (
            <Grid key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
              <CourseCard
                id={course._id}
                title={course.title}
                color={getRandomColor()}
              />
            </Grid>
          ))}
    </Grid>
  );
};

export default CourseList;
