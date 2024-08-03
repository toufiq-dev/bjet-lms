import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Container,
    Box,
    useMediaQuery,
    useTheme,
    IconButton,
} from '@mui/material';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
    '& .module-actions': {
        marginLeft: 'auto',
        display: 'flex',
        gap: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CreateModule = () => {
    const [expanded, setExpanded] = useState<string | false>('panel1');

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: isMobile ? 2 : 0,
                }}
            >
                <Typography component="h1" variant="h4" align="center">
                    Module and Lesson Structure
                </Typography>
                <Box sx={{ width: '100%' }}>
                    {/* Module 1 */}
                    <Accordion expanded={expanded === 'module1'} onChange={handleChange('module1')}>
                        <AccordionSummary aria-controls="module1d-content" id="module1d-header">
                            <Typography>Module 1</Typography>
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
                            <Typography>Lesson 1</Typography>
                            <Typography>Lesson 2</Typography>
                        </AccordionDetails>
                    </Accordion>

                    {/* Module 2 */}
                    <Accordion expanded={expanded === 'module2'} onChange={handleChange('module2')}>
                        <AccordionSummary aria-controls="module2d-content" id="module2d-header">
                            <Typography>Module 2</Typography>
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
                            <Typography>Lesson 1</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateModule;
