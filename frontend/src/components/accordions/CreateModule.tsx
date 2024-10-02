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
import { Module } from "../../interfaces/moduleInterface"; // Adjust the path as necessary

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
  alignItems: "center", // Center items vertically
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    alignItems: "center", // Center content vertically
    display: "flex",
  },
  "& .module-actions": {
    marginLeft: "auto",
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center", // Center actions vertically
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
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
            {/* Placeholder for lessons */}
            <Typography>Order: {module.order}</Typography>
            <Typography>Lock Until: {new Date(module.lockUntil).toLocaleString()}</Typography>
            <Typography>Published: {module.isPublished ? "Yes" : "No"}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CreateModule;
