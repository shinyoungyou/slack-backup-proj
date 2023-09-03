import { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useAppSelector } from "@/stores/configureStore";
import MessageListItem from "./MessageListItem";
import MessageListItemSkeleton from "./MessageListItemSkeleton";
import DateFilters from "./DateFilters";
import { selectGroupedMessages } from "@/stores/messagesSlice";

export default function MessageList() {
  const { messagesLoaded } = useAppSelector((state) => state.messages);
  const groupedMessages = useAppSelector(selectGroupedMessages);
  const [selectDate, setSelectDate] = useState<string>('');

  useEffect(() => {
    if (dateRef.current) {
      const yOffset = dateRef.current?.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        behavior: "smooth",
        top: yOffset,
      });
    }

    setSelectDate('');
  }, [selectDate])

  const dateRef =useRef<HTMLDivElement>(null);

  const scrollToSpecificDate = (date: string) => {
    console.log(date);
    
    setSelectDate(date);
  };

  console.log(groupedMessages);

  return (
    <>
      {groupedMessages.map(([group, messages]) => (
        <div key={group}>
          {selectDate === group && <div ref={dateRef}></div>}
          <DateFilters group={group} scrollToSpecificDate={scrollToSpecificDate}  />
          <Grid container spacing={4}>
              {messages.map((message) => (
                <Grid key={message.slackId} item xs={12}>
                  {!messagesLoaded ? (
                    <MessageListItemSkeleton />
                  ) : (
                    <MessageListItem message={message} />
                  )}
                </Grid>
              ))}
          </Grid>
        </div>
      ))}
    </>
  );
}
