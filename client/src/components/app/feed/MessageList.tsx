import { Grid } from "@mui/material";
import { Message } from "@/models/message";
import { useAppSelector } from "@/stores/configureStore";
import MessageListItem from "./MessageListItem";
import MessageListItemSkeleton from "./MessageListItemSkeleton";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  const { messagesLoaded } = useAppSelector((state) => state.messages);
  return (
    <Grid container spacing={4}>
      {messages.map((message) => (
        <Grid key={message.id} item xs={4}>
          {!messagesLoaded ? (
            <MessageListItemSkeleton />
          ) : (
            <MessageListItem message={message} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
