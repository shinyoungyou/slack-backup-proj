import { Grid } from "@mui/material";
import { Message } from "@/models/message";
import { useAppSelector } from "@/stores/configureStore";
import MessageListItem from "./MessageListItem";
import MessageListItemSkeleton from "./MessageListItemSkeleton";
import DateFilters from "./DateFilters";
import { selectGroupedMessages } from "@/stores/messagesSlice";

export default function MessageList() {
  const { messagesLoaded } = useAppSelector((state) => state.messages);
  const groupedMessages = useAppSelector(selectGroupedMessages);

  console.log(groupedMessages);

  return (
    <>
      {groupedMessages.map(([group, messages]) => (
        <>
          <DateFilters group={group} key={group} />
          <Grid container spacing={4} key={group+'a'}>
            <>
              {messages.map((message) => (
                <Grid key={message.slackId} item xs={12}>
                  {!messagesLoaded ? (
                    <MessageListItemSkeleton />
                  ) : (
                    <MessageListItem message={message} />
                  )}
                </Grid>
              ))}
            </>
          </Grid>
        </>
      ))}
    </>
  );
}
