import React, { useState } from "react";
import { styled } from "@mui/material/styles";
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

type Props = {
  modules: Module[];
  open: boolean;
  toggleDrawer: () => void;
  title: string;
  refetch: () => void;
};

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={1} square {...props} />
))(({ theme }) => ({
  borderRadius: "8px",
  margin: theme.spacing(1, 0),
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  alignItems: "center",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
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
  backgroundColor: "#f9f9f9",
  padding: theme.spacing(3),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "#fff",
  },
}));

const ModuleList: React.FC<Props> = (props) => {
  const [expanded, setExpanded] = useState<string | false>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
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

  return (
    <Box sx={{ width: "100%" }}>
      {props.modules.map((module, index) => (
        <Accordion
          key={module._id}
          expanded={expanded === `module${index}`}
          onChange={handleAccordionChange(`module${index}`)}
        >
          <AccordionSummary
            aria-controls={`module${index}d-content`}
            id={`module${index}d-header`}
          >
            <Typography>{module.title}</Typography>
            <Box className="module-actions">
              <ActionButton
                aria-label="add lesson"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent Accordion from toggling
                  handleOpenModal(module._id);
                }}
              >
                <AddIcon />
              </ActionButton>
              <ActionButton
                aria-label="edit module"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent Accordion from toggling
                  /* Handle edit */
                }}
              >
                <EditIcon />
              </ActionButton>
              <ActionButton
                aria-label="delete module"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent Accordion from toggling
                  /* Handle delete */
                }}
              >
                <DeleteIcon />
              </ActionButton>

            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                {/* Lesson details */}
                <Typography variant="h6">Lessons:</Typography>
                {module.lessonRefs && module.lessonRefs.length > 0 ? (
                  module.lessonRefs.map((lesson: Lesson) => (
                    <Box key={lesson._id} sx={{ marginBottom: 2 }}>
                      <Typography variant="body1">Title: {lesson.title}</Typography>
                      <Typography variant="body2">Order: {lesson.order}</Typography>
                      <img src={lesson.content} alt={lesson.title} width="100%" />
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

      {/* Lesson creation modal */}
      <LessonCreationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onLessonCreate={handleLessonCreate}
        moduleId={selectedModuleId}
      />
    </Box>
  );
};

export default ModuleList;
