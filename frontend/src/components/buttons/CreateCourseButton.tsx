import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const CreateCourseButton = () => {
  const navigate = useNavigate();

  return (
    <Button variant="contained" onClick={() => navigate("/create-course")}>
      Create a Course
    </Button>
  );
};

export default CreateCourseButton;
