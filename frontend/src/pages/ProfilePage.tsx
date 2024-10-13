import React from "react";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";

const drawerWidth = 150;  // Consistent drawer width

const ProfilePage = () => {
  const name = useSelector((state: IState) => state.user.name);
  const role = useSelector((state: IState) => state.user.role);

  return (
    <Box display="flex">
      {/* Responsive Drawer */}
      <ResponsiveDrawer
        breadcrumbs={[
          { name: "Account", link: "/profile" },
        ]}
        drawerItemIndex={0}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />  {/* This maintains space between the drawer and the content */}

        {/* Profile Information */}
        <Box sx={{ textAlign: "center", paddingTop: "5%" }}>
          <Typography variant="h4" gutterBottom>
            Account Details
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {name}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {role}
          </Typography>

          {/* Password Change Form */}
          <Box sx={{ mt: 4 }}>
            <ChangePasswordForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
