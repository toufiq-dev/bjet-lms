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

// Custom styled components for Accordion, AccordionSummary, and AccordionDetails
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
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "1rem", color: "#1976d2" }} />}
    {...props}
  />
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

// Icon button customization
const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "#fff",
  },
}));

// Reusable component for displaying modules as accordions
interface CreateModuleProps {
  modules: Module[]; // Pass modules as a prop
}

const CreateModule: React.FC<CreateModuleProps> = ({ modules }) => {
  const [expanded, setExpanded] = useState<string | false>("");

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Box sx={{ width: "100%" }}>
      {modules.map((module, index) => (
        <Accordion
          key={module._id}
          expanded={expanded === `module${index}`}
          onChange={handleChange(`module${index}`)}
        >
          <AccordionSummary
            aria-controls={`module${index}d-content`}
            id={`module${index}d-header`}
          >
            <Typography>{module.title}</Typography>
            <Box className="module-actions">
              <ActionButton aria-label="add lesson">
                <AddIcon />
              </ActionButton>
              <ActionButton aria-label="edit module">
                <EditIcon />
              </ActionButton>
              <ActionButton aria-label="delete module">
                <DeleteIcon />
              </ActionButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary">
              Order: {module.order}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Lock Until: {new Date(module.lockUntil).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Published: {module.isPublished ? "Yes" : "No"}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CreateModule;
