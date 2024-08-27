import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import navigationLinks from "../../assets/navigationLinks.json";
import Fade from "@mui/material/Fade";
import { Link } from "react-router-dom";

type Props = {
  anchorEl: null | HTMLElement;
  open: boolean;
  menuItemIndex?: number;
  handleClose: () => void;
};
const BasicMenu = (props: Props) => {
  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Fade}
      >
        {navigationLinks.map((nav, index) => (
          <MenuItem key={index}>
            <Link to={nav.link} style={{ textDecoration: "none" }}>
              <Typography
                color="primary"
                fontWeight={props.menuItemIndex === index ? "bold" : "normal"}
              >
                {nav.name}
              </Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default BasicMenu;
