import { useState } from "react";
import {
    Button,
    Box,
    Typography,
    Container,
    CircularProgress,
    Paper,
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
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h4">
                    Bulk Student Registration
                </Typography>
                <Paper
                    elevation={0}
                    square
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 4,
                        marginTop: 2,
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handlerOnSubmit}
                        sx={{ mt: 1 }}
                    >
                        <BulkUserInput emails={emails} setEmails={setEmails} />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
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
