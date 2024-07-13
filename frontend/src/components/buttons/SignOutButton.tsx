import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { removeSignIn } from "../../redux/slices/userSlice";
import useUser from "../../hooks/useUser";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CustomAlert from "../alerts/CustomAlert";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";

const SignOutButton = () => {
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [data, setData] = useState({
    success: true,
    message: "",
    data: {},
  });

  const dispatch = useDispatch();
  const { signOut } = useUser();

  const handleSignOut = async () => {
    setShowCircularProgress(true);
    const result = await signOut();
    setShowCircularProgress(false);
    if (result.error) {
      setData(result.error.response.data);
      setOpenAlert(true);
    } else {
      dispatch(removeSignIn());
    }
  };

  return (
    <>
      {openAlert && (
        <CustomAlert
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          severity="error"
          message={data.message}
        />
      )}
      <Button variant="outlined" onClick={handleSignOut}>
        {showCircularProgress === true ? (
          <CircularProgress color="inherit" size={25} />
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <LogoutIcon fontSize="small" />
            Sign Out
          </Box>
        )}
      </Button>
    </>
  );
};

export default SignOutButton;
