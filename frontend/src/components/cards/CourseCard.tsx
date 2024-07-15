import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type Props = {
  title: string;
};

const CourseCard = (props: Props) => {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardHeader sx={{ height: "10em", backgroundColor: "#1876D2" }} />
      <CardContent sx={{ height: "8em" }}>
        <Typography variant="h5">{props.title}</Typography>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
