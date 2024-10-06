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
import { Box, IconButton } from "@mui/material";
import { Module } from "../../interfaces/moduleInterface";
import LessonCreationModal from "../modals/LessonCreationModal";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
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
    alignItems: "center",
    display: "flex",
  },
  "& .module-actions": {
    marginLeft: "auto",
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

interface CreateModuleProps {
  modules: Module[];
}

const CreateModule: React.FC<CreateModuleProps> = ({ modules }) => {
  const [expanded, setExpanded] = useState<string | false>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleOpenModal = (moduleId: string) => {
    setSelectedModuleId(moduleId); // Set the selected module ID
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLessonCreate = () => {
    // Logic to refresh lessons goes here
  };

  return (
    <Box sx={{ width: "100%" }}>
      {modules.map((module, index) => (
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
              <IconButton aria-label="add lesson" onClick={() => handleOpenModal(module._id)}>
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
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Lesson creation modal */}
      <LessonCreationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onLessonCreate={handleLessonCreate}
        moduleId={selectedModuleId} // Pass the selected module ID
      />
    </Box>
  );
};

export default CreateModule;
