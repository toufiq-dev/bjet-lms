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
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import BasicMenu from "../menus/BasicMenu";

type Props = {
  breadcrumbs?: {
    name: string;
    link: string;
  }[];
  drawerItemIndex: number;
  menuItemIndex?: number;
};

const ResponsiveDrawer = (props: Props) => {
  const drawerWidth = 150;
  const role = useSelector((state: IState) => state.user.role);
  const items = ["Account", "Dashboard", "Courses"];
  const filteredItems = role === "Admin" ? ["Account", "Dashboard"] : items;
  const links = ["/profile", "/", "", ""];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDrawerClose = () => {
    setIsDrawerClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsDrawerClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isDrawerClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleMenuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            <Link
              key={index}
              to={links[index]}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItem disablePadding>
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
                      <AccountCircleIcon
                        fontSize="large"
                        color={
                          props.drawerItemIndex === index
                            ? "primary"
                            : "inherit"
                        }
                      />
                    ) : index === 1 ? (
                      <DashboardIcon
                        fontSize="large"
                        color={
                          props.drawerItemIndex === index
                            ? "primary"
                            : "inherit"
                        }
                      />
                    ) : index == 2 ? (
                      <MenuBookIcon
                        fontSize="large"
                        color={
                          props.drawerItemIndex === index
                            ? "primary"
                            : "inherit"
                        }
                      />
                    ) : (
                      <InboxIcon
                        fontSize="large"
                        color={
                          props.drawerItemIndex === index
                            ? "primary"
                            : "inherit"
                        }
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      color:
                        props.drawerItemIndex === index ? "#1876D2" : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", sm: "start" },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {!props.breadcrumbs ? (
            <Typography
              noWrap
              component="h1"
              sx={{
                pl: { xs: "25%", sm: "0%" },
                fontSize: { xs: "1rem", sm: "2.5rem" },
                width: "100%",
              }}
            >
              Dashboard
            </Typography>
          ) : (
            props.breadcrumbs.length !== 0 && (
              <>
                <Breadcrumbs
                  separator="›"
                  aria-label="breadcrumb"
                  sx={{ display: { xs: "none", sm: "block" }, color: "white" }}
                >
                  {props.breadcrumbs?.map((breadcrumb, index) =>
                    props.breadcrumbs &&
                      index === props.breadcrumbs.length - 1 ? (
                      <Typography key={index} variant="h6" color="white">
                        {breadcrumb.name}
                      </Typography>
                    ) : (
                      <Link
                        key={index}
                        to={breadcrumb.link}
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            ":hover": {
                              textDecoration: "underline",
                              textDecorationThickness: "1px",
                            },
                          }}
                        >
                          {breadcrumb.name}
                        </Typography>
                      </Link>
                    )
                  )}
                </Breadcrumbs>
                <Box
                  textAlign="center"
                  sx={{ display: { xs: "block", sm: "none" } }}
                >
                  <Typography>{props.breadcrumbs?.[0].name}</Typography>
                  <Typography>
                    {props.breadcrumbs?.[props.breadcrumbs.length - 1].name}
                  </Typography>
                </Box>
                {!isMenuOpen ? (
                  <IconButton color="inherit" onClick={handleMenuToggle}>
                    <KeyboardArrowDownIcon
                      sx={{ display: { xs: "block", sm: "none" } }}
                    />
                  </IconButton>
                ) : (
                  <IconButton color="inherit" onClick={handleMenuToggle}>
                    <CloseIcon sx={{ display: { xs: "block", sm: "none" } }} />
                    <BasicMenu
                      anchorEl={anchorEl}
                      open={open}
                      menuItemIndex={props.menuItemIndex}
                      handleClose={handleClose}
                    />
                  </IconButton>
                )}
              </>
            )
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
              width: drawerWidth,
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
              width: drawerWidth,
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
