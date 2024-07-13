import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SignOutButton from "../buttons/SignOutButton";
import { useSelector } from "react-redux";
import IState from "../../interfaces/stateInterface";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";

type Props = {
  title: string;
  drawerWidth: number;
};

const ResponsiveDrawer = (props: Props) => {
  const role = useSelector((state: IState) => state.user.role);
  const items = ["Account", "Dashboard", "Courses", "Inbox"];
  const filteredItems = role === "Admin" ? ["Account", "Dashboard"] : items;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: 1,
          paddingBottom: 5,
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <List>
          {filteredItems.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                  }}
                >
                  {index === 0 ? (
                    <AccountCircleIcon fontSize="large" />
                  ) : index === 1 ? (
                    <DashboardIcon fontSize="large" />
                  ) : index == 2 ? (
                    <MenuBookIcon fontSize="large" />
                  ) : (
                    <InboxIcon fontSize="large" />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box>
          <Divider sx={{ marginBottom: 5 }} />
          <SignOutButton />
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${props.drawerWidth}px)` },
          ml: { sm: `${props.drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="h1">
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Navigation drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: props.drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: props.drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default ResponsiveDrawer;