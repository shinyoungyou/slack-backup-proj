import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { messageSelectors } from "@/stores/messagesSlice";
import { useAppSelector } from "@/stores/configureStore";

export default function FeedPage() {
  const messages = useAppSelector(messageSelectors.selectAll);
  return (
    <>
      <MessageList messages={messages} />
    </>
  );
}
