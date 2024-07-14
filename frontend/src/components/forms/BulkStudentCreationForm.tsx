import { useState } from "react";
import {
    Button,
    Box,
    Typography,
    Container,
    CircularProgress,
    Paper,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CustomAlert from "../alerts/CustomAlert";
import BulkUserInput from "../inputs/BulkUserInput";

const BulkStudentCreationForm = () => {
    const [showCircularProgress, setShowCircularProgress] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertData, setAlertData] = useState({
        success: true,
        message: "",
    });
    const [emails, setEmails] = useState<string[]>([]);

    const handlerOnSubmit = async () => {
        setShowCircularProgress(true);

        setTimeout(() => {
            setShowCircularProgress(false);
            setAlertData({ success: true, message: "Students created successfully" });
            setOpenAlert(true);
        }, 2000);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Container component="main" maxWidth="xs">
            {openAlert && (
                <CustomAlert
                    open={openAlert}
                    onClose={() => setOpenAlert(false)}
                    severity={alertData.success ? "success" : "error"}
                    message={alertData.message}
                />
            )}
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: isMobile ? 2 : 0,
                }}
            >
                <Typography component="h1" variant="h4" align="center">
                    Bulk Student Registration
                </Typography>
                <Paper
                    elevation={0}
                    square
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: isMobile ? 2 : 4,
                        marginTop: 2,
                        width: "100%",
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handlerOnSubmit}
                        sx={{
                            mt: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <BulkUserInput emails={emails} setEmails={setEmails} />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={!isMobile}
                            sx={{ mt: 8, mb: 2 }}
                        >
                            {showCircularProgress ? (
                                <CircularProgress color="inherit" size={25} />
                            ) : (
                                "Create Students"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default BulkStudentCreationForm;
