import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import navigationLinks from "../../assets/navigationLinks.json";

type Props = {
  menuItemIndex?: number;
};

const CourseNavigations = (props: Props) => {
  return (
    <Box display={{ xs: "none", sm: "block" }}>
      {navigationLinks.map((nav, index) => (
        <Link key={index} to={nav.link} style={{ textDecoration: "none" }}>
          <Typography
            color={props.menuItemIndex === index ? "#2D3B45" : "primary"}
            fontWeight={props.menuItemIndex === index ? "bold" : "normal"}
            borderLeft={
              props.menuItemIndex === index ? "2px solid #2D3B45" : "0px"
            }
            p={1}
            sx={{ ":hover": { textDecoration: "underline" } }}
          >
            {nav.name}
          </Typography>
        </Link>
      ))}
    </Box>
  );
};

export default CourseNavigations;
