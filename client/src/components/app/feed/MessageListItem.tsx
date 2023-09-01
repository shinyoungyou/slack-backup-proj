import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Message } from "@/models/message";

interface Props {
  message: Message;
}

export default function MessageListItem({ message }: Props) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {"Nikola Jaden".charAt(0).toUpperCase()}
          </Avatar>
        }
        title="Nikola Jaden"
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "primary.light",
        }}
        image="https://res.cloudinary.com/dj3wmuy3l/image/upload/v1682889711/yrxnopndnfhjs71acsnn.png"
        title="sample"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {message.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/messages/${message.id}`} size="small">
          View
        </Button>
      </CardActions>
    </Card>
  );
}
