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
import { format } from 'date-fns';

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
        subheader={format(new Date(message.postedDate), 'AM, PM')}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
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
