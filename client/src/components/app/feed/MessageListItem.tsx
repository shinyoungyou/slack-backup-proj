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
          <Avatar alt={message.displayName} src={message.userPicturePath} />
        }
        title={message.displayName}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      {message.files.length > 0 &&
        message.files.map((file) => (
          // <CardMedia
          //   sx={{
          //     height: 140,
          //     backgroundSize: "contain",
          //     bgcolor: "primary.light",
          //   }}
          //   image={file.picturePath}
          //   title={file.title}
          // />
          <img src="https://files.slack.com/files-pri/T05PY1ZSF8A-F05QS8B8BTN/asdf.jpeg?pub_secret=954da20cf9" alt={file.title} key={file.id} />
        ))}
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
