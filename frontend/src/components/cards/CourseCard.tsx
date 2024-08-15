import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";

type Props = {
  id?: string;
  title?: string;
  color?: string;
  loading?: boolean;
};

const CourseCard = (props: Props) => {
  return (
    <Link to={`/courses/${props.id}`} style={{ textDecoration: "none" }}>
      <Card
        elevation={3}
        raised
        sx={{
          maxWidth: 300,
          mx: "auto",
          ":hover": {
            cursor: "pointer",
            boxShadow: (theme) => theme.shadows[6],
          },
        }}
      >
        {props.loading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={300}
            height={160}
          />
        ) : (
          <CardHeader sx={{ height: "10em", backgroundColor: props.color }} />
        )}
        <CardContent sx={{ height: "8em" }}>
          {props.loading ? (
            <Skeleton animation="wave" variant="text" width="100%" />
          ) : (
            <Typography
              component="h2"
              variant="h6"
              color={props.color}
              sx={{ ":hover": { textDecoration: "underline" } }}
            >
              {props.title}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
