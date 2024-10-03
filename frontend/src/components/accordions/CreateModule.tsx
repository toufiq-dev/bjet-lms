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

// Custom styled components
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

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "#fff",
  },
}));

// Reusable component for displaying modules as accordions
interface CreateModuleProps {
  modules: Module[];
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
            {/* Module Information in a Grid Layout */}
            <Grid container spacing={2} alignItems="center">
              {/* Order Info */}
              <Grid item xs={4}>
                <Box display="flex" alignItems="center">
                  <ViewModuleIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body1" color="textPrimary">
                    Order:
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" color="textSecondary">
                  {module.order}
                </Typography>
              </Grid>

              <Divider flexItem />

              {/* Lock Until Info */}
              <Grid item xs={4}>
                <Box display="flex" alignItems="center">
                  <CalendarTodayIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body1" color="textPrimary">
                    Lock Until:
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" color="textSecondary">
                  {new Date(module.lockUntil).toLocaleString()}
                </Typography>
              </Grid>

              <Divider flexItem />

              {/* Published Info */}
              <Grid item xs={4}>
                <Box display="flex" alignItems="center">
                  <CheckCircleOutlineIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body1" color="textPrimary">
                    Published:
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" color="textSecondary">
                  {module.isPublished ? "Yes" : "No"}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CreateModule;
