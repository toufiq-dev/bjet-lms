import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const LessonModuleTestButton = () => {
    const navigate = useNavigate();

    return (
        <Button variant="contained" onClick={() => navigate("/courses")}>
            Lesson Module Test
        </Button>
    );
};

export default LessonModuleTestButton;
