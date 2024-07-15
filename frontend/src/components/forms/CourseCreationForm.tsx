import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../alerts/CustomAlert";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import useCourse from "../../hooks/useCourse";
import { useSelector } from "react-redux";
import IState from "../../interfaces/stateInterface";

const CourseCreationForm = () => {
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [data, setData] = useState({
    success: true,
    message: "",
    data: {},
  });

  const navigate = useNavigate();
  const { createCourse } = useCourse();
  const id = useSelector((state: IState) => state.user.id);

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handlerOnSubmit = async () => {
    setShowCircularProgress(true);
    const formData = {
      teacherRef: id,
      title: getValues("title"),
      description: getValues("description"),
    };

    const result = await createCourse(formData);
    setShowCircularProgress(false);
    if (result.error) {
      setData(result.error.response.data);
      setOpenAlert(true);
    } else {
      console.log(result.data._id);
      navigate(`/courses/${result.data._id}`);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      {openAlert && (
        <CustomAlert
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          severity="error"
          message={data.message}
        />
      )}
      <Box component="form" onSubmit={handleSubmit(handlerOnSubmit)}>
        <Button
          variant="contained"
          type="submit"
          sx={{ float: "right", mb: 3 }}
        >
          {showCircularProgress === true ? (
            <CircularProgress color="inherit" size={25} />
          ) : (
            <>Create</>
          )}
        </Button>
        <Controller
          name="title"
          control={control}
          rules={{
            maxLength: {
              value: 200,
              message: "Character limit exceeded",
            },
          }}
          render={({ field }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label={errors.title ? errors.title.message : "Title"}
              autoFocus
              {...field}
              error={errors.title ? true : false}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: {
              value: 1000,
              message: "Character limit exceeded",
            },
          }}
          render={({ field }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label={errors.title ? errors.title.message : "Description"}
              multiline
              minRows={2}
              {...field}
              error={errors.title ? true : false}
            />
          )}
        />
      </Box>
    </Container>
  );
};

export default CourseCreationForm;
