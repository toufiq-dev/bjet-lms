import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const CreateCourseButton = () => {
  return (
    <Link to="/create-course">
      <Button variant="contained">Create a Course</Button>
    </Link>
  );
};

export default CreateCourseButton;
