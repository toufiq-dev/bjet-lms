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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";

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
  const [expanded, setExpanded] = useState<string | false>(false);

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

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
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

        {/* Display modules in Accordion */}
        <Box mt={4}>
          {modules.length > 0 ? (
            modules.map((module, index) => (
              <Accordion
                key={module._id}
                expanded={expanded === `module${index}`}
                onChange={handleChange(`module${index}`)}
              >
                <AccordionSummary
                  expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
                  aria-controls={`module${index}-content`}
                  id={`module${index}-header`}
                >
                  <Typography>{module.title}</Typography>
                  <Box className="module-actions" ml="auto">
                    <IconButton aria-label="add lesson">
                      <AddIcon />
                    </IconButton>
                    <IconButton aria-label="edit module">
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete module">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Order: {module.order}</Typography>
                  <Typography>Lock Until: {new Date(module.lockUntil).toLocaleString()}</Typography>
                  <Typography>Published: {module.isPublished ? "Yes" : "No"}</Typography>
                  {/* You can add lessons or other details inside this accordion */}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography>No modules available</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseHomePage;
