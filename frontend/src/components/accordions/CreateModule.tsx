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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, IconButton, Divider, Grid } from "@mui/material";
import { Module } from "../../interfaces/moduleInterface";
import LessonCreationModal from "../modals/LessonCreationModal";

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
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(2),
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  "& .module-actions": {
    marginLeft: "auto",
    display: "flex",
    gap: theme.spacing(1),
  },
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
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

interface CreateModuleProps {
  modules: Module[];
}

const CreateModule: React.FC<CreateModuleProps> = ({ modules }) => {
  const [expanded, setExpanded] = useState<string | false>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  const handleAccordionChange = (moduleId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? moduleId : false);
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
    <Box>
      {modules.map((module) => (
        <Accordion key={module._id} expanded={expanded === module._id} onChange={handleAccordionChange(module._id)}>
          <AccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon />}
            aria-controls={`${module._id}-content`}
            id={`${module._id}-header`}
          >
            <ViewModuleIcon style={{ marginRight: 8 }} />
            <Typography variant="subtitle1">{module.title}</Typography>
            <Box className="module-actions">
              <ActionButton onClick={() => handleOpenModal(module._id)}>
                <AddIcon />
              </ActionButton>
              <ActionButton>
                <EditIcon />
              </ActionButton>
              <ActionButton>
                <DeleteIcon />
              </ActionButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* Render lessons here */}
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
