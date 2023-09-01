import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { messageSelectors } from "@/stores/messagesSlice";
import { useAppSelector } from "@/stores/configureStore";

export default function FeedPage() {
  const { user } = useAppSelector((state) => state.account);
  const messages = useAppSelector(messageSelectors.selectAll);
  return (
    <>
      {user ? `Welcome ${user.username}` : "FeedPage"}
      <MessageList messages={messages} />
    </>
  );
}
