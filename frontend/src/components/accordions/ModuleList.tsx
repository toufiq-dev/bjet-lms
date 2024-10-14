import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Divider, Grid } from "@mui/material";
import { Module } from "../../interfaces/moduleInterface";
import { Lesson } from "../../interfaces/lessonInterface";
import LessonCreationModal from "../modals/LessonCreationModal";
import TemporaryDrawer from "../drawers/TemporaryDrawer";
import LessonEditModal from "../modals/LessonEditModal";
import useLesson from "../../hooks/useLesson";
import useModule from "../../hooks/useModule";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { useSelector } from "react-redux";
import IState from "../../interfaces/stateInterface";

type Props = {
  modules: Module[];
  open: boolean;
  toggleDrawer: () => void;
  title: string;
  refetch: () => void;
};

// Accordion styling
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={1} square {...props} />
))(({ theme }) => ({
  borderRadius: "8px",
  margin: theme.spacing(2, 0),
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  "&:before": {
    display: "none",
  },
  "&:hover": {
    boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.15)",
  },
}));

// Accordion summary styling
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "1rem", color: "inherit" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 240, 0.9)",
  padding: theme.spacing(2),
  flexDirection: "row-reverse",
  alignItems: "center",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(240, 240, 240, 1)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  "& .module-actions": {
    marginLeft: "auto",
    display: "flex",
    gap: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "#fff",
  },
}));

const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  padding: theme.spacing(1),
  borderRadius: '4px',
  transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s',
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "#fff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const ModuleList: React.FC<Props> = (props) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedModuleTitle, setSelectedModuleTitle] = useState("");

  // New state for lesson editing and deleting
  const [isLessonEditModalOpen, setIsLessonEditModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedLessonTitle, setSelectedLessonTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>("");
  const [deleteType, setDeleteType] = useState<"lesson" | "module">("lesson");

  const { deleteLesson } = useLesson();
  const { deleteModule } = useModule();

  // Get role from the Redux state
  const role = useSelector((state: IState) => state.user.role);

  // Open delete modal with appropriate type
  const handleOpenDeleteModal = (id: string, type: "lesson" | "module") => {
    setDeleteTargetId(id);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const handleAccordionChange = (panel: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(panel)
        ? prevExpanded.filter((p) => p !== panel)
        : [...prevExpanded, panel]
    );
  };

  const handleOpenModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLessonCreate = () => {
    props.refetch();
  };

  const handleOpenLessonEditModal = (lessonId: string, currentTitle: string) => {
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(currentTitle);
    setIsLessonEditModalOpen(true);
  };

  const handleCloseLessonEditModal = () => {
    setIsLessonEditModalOpen(false);
  };

  const handleOpenDrawer = (moduleId: string, title: string) => {
    setSelectedModuleId(moduleId);
    setSelectedModuleTitle(title);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDeleteLesson = (lessonId: string) => {
    handleOpenDeleteModal(lessonId, "lesson");
  };

  const handleDeleteModule = (moduleId: string) => {
    handleOpenDeleteModal(moduleId, "module");
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    if (deleteType === "lesson") {
      const response = await deleteLesson(deleteTargetId);
      if (!response.error) {
        props.refetch();
      } else {
        console.error("Failed to delete lesson", response.error);
      }
    } else if (deleteType === "module") {
      const response = await deleteModule(deleteTargetId);
      if (!response.error) {
        props.refetch();
      } else {
        console.error("Failed to delete module", response.error);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      {props.modules.map((module, index) => (
        <Accordion
          key={module._id}
          expanded={expanded.includes(`module${index}`)}
          onChange={() => handleAccordionChange(`module${index}`)}
        >
          <AccordionSummary
            aria-controls={`module${index}d-content`}
            id={`module${index}d-header`}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {module.title}
            </Typography>
            {role === "Teacher" && ( // Only render if the user is a teacher
              <Box className="module-actions">
                <ActionButton
                  aria-label="add lesson"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenModal(module._id);
                  }}
                >
                  <AddIcon />
                </ActionButton>
                <ActionButton
                  aria-label="edit module"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenDrawer(module._id, module.title);
                  }}
                >
                  <EditIcon />
                </ActionButton>
                <ActionButton
                  aria-label="delete module"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteModule(module._id);
                  }}
                >
                  <DeleteIcon />
                </ActionButton>
              </Box>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                {module.lessonRefs && module.lessonRefs.length > 0 ? (
                  module.lessonRefs.map((lesson: Lesson) => (
                    <Box key={lesson._id} sx={{ marginBottom: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <StyledLink
                          href={lesson.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {lesson.title}
                        </StyledLink>
                        {role === "Teacher" && ( // Only render if the user is a teacher
                          <Box>
                            <IconButton
                              aria-label="edit lesson"
                              onClick={() =>
                                handleOpenLessonEditModal(
                                  lesson._id,
                                  lesson.title
                                )
                              }
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete lesson"
                              onClick={() => handleDeleteLesson(lesson._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      <Divider sx={{ marginY: 1 }} />
                    </Box>
                  ))
                ) : (
                  <Typography>No lessons available</Typography>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modals */}
      <LessonCreationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onLessonCreate={handleLessonCreate}
        moduleId={selectedModuleId}
      />

      <LessonEditModal
        open={isLessonEditModalOpen}
        onClose={handleCloseLessonEditModal}
        lessonId={selectedLessonId}
        currentTitle={selectedLessonTitle}
        refetch={props.refetch}
      />

      <TemporaryDrawer
        open={drawerOpen}
        toggleDrawer={handleCloseDrawer}
        title="Edit Module"
        moduleId={selectedModuleId}
        refetch={props.refetch}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={deleteType === "lesson" ? "Delete Lesson" : "Delete Module"}
        message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
      />
    </Box>
  );
};

export default ModuleList;
