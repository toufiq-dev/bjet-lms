import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles"; // Import useTheme
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

// Fix: Use the theme in the callback directly
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

const ModuleList: React.FC<Props> = (props) => {
  const theme = useTheme(); // Access theme here if needed

  const [expanded, setExpanded] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  const handleAccordionChange = (panel: string) => {
    setExpanded((prevExpanded) =>
      prevExpanded.includes(panel)
        ? prevExpanded.filter((p) => p !== panel) // Close the panel if it was already open
        : [...prevExpanded, panel] // Open the panel if it was closed
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

  return (
    <Box sx={{ width: "100%" }}>
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
                <Typography variant="subtitle1">Lessons:</Typography>
                {module.lessonRefs && module.lessonRefs.length > 0 ? (
                  module.lessonRefs.map((lesson: Lesson) => (
                    <Box key={lesson._id} sx={{ marginBottom: 2 }}>
                      <Typography variant="body1">
                        <a href={lesson.content} target="_blank" rel="noopener noreferrer">
                          {lesson.title}
                        </a>
                      </Typography>
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
