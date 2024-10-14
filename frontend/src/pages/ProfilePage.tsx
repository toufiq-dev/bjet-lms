import React from "react";
import { useSelector } from "react-redux";
import IState from "../interfaces/stateInterface";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";

const drawerWidth = 150;

const ProfilePage = () => {
  const name = useSelector((state: IState) => state.user.name);
  const role = useSelector((state: IState) => state.user.role);

  // Extract initials for Avatar
  const initials = (name ?? "").split(" ").map(n => n[0]).join("");

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
        <Toolbar />  {/* Keeps content properly spaced from the drawer */}

        {/* Profile Information Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: "5%" }}>
          <Card sx={{ maxWidth: 600, padding: 4, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              {/* User Avatar */}
              <Avatar sx={{
                bgcolor: deepPurple[500],
                width: 80,
                height: 80,
                fontSize: "2rem",
                margin: "0 auto"
              }}>
                {initials}
              </Avatar>

              {/* Account Details */}
              <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
                Account Details
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {name}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {role}
              </Typography>

              {/* Password Change Form */}
              <Box sx={{ mt: 4 }}>
                <ChangePasswordForm />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
