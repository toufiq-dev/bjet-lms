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
import useUser from "../../hooks/useUser";

const BulkStudentCreationForm = () => {
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    success: true,
    message: "",
  });
  const [emails, setEmails] = useState<string[]>([]);

  const { createStudents } = useUser(); // Destructure createStudents from useUser

  const handlerOnSubmit = async () => {
    setShowCircularProgress(true);

    try {
      const response = await createStudents(emails);
      if (response.error) {
        throw new Error(response.error);
      }

      let alertMessage = "Bulk registration completed.\n";
      const { success, failures } = response;

      if (success.length > 0) {
        alertMessage += `Successfully registered: ${success.join(", ")}.\n`;
      }

      if (failures.length > 0) {
        alertMessage += "Failures:\n";
        failures.forEach((failure: { email: string; reason: string }) => {
          alertMessage += `Email: ${failure.email}, Reason: ${failure.reason}\n`;
        });
      }

      setAlertData({
        success: failures.length === 0, // If there are no failures, success is true
        message: alertMessage,
      });
    } catch (error) {
      console.error("Failed to create students:", error);
      setAlertData({
        success: false,
        message:
          (error as { response: { data: { message: string } } }).response?.data
            ?.message || "Failed to create students",
      });
    } finally {
      setShowCircularProgress(false);
      setOpenAlert(true);
    }
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
          Student Registration
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
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="body1"
              sx={{ textAlign: "center", marginBottom: 1 }}
            >
              Add student(s) by Email Address
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", marginBottom: 2 }}
            >
              When adding multiple students, use a Comma, Space, or Enter key to
              separate emails.
            </Typography>
            <BulkUserInput emails={emails} setEmails={setEmails} />
            <Button
              type="submit"
              variant="contained"
              fullWidth={!isMobile}
              sx={{ mt: 4, mb: 2 }}
              onClick={handlerOnSubmit}
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
