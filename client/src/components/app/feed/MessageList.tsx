import { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";
import MessageListItem from "./MessageListItem";
import MessageListItemSkeleton from "./MessageListItemSkeleton";
import DateFilters from "./DateFilters";
import { messageSelectors, fetchMessagesAsync, selectMessagesByDate, setMessageParams } from "@/stores/messagesSlice";
import { Message } from "@/models/message";
import { format, parse } from 'date-fns';

export default function MessageList() {
  const { messagesLoaded, messageParams } = useAppSelector((state) => state.messages);
  const messages = useAppSelector(messageSelectors.selectAll);
  const [selectDate, setSelectDate] = useState<string>('');
  const messagesByDate = useAppSelector(selectMessagesByDate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (messagesLoaded && messageParams.selectedDate) {      
      setSelectDate(formattedDate(new Date(messageParams.selectedDate)));
    }
  }, [messagesLoaded, messageParams]);

  useEffect(() => {
    if (selectDate === '') return;
    if (dateRef.current) {
      const yOffset = dateRef.current?.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        behavior: "smooth",
        top: yOffset,
      });
    } else {
      let original = parse(selectDate, 'EEE, MMM dd yyyy', new Date());
      dispatch(setMessageParams({ selectedDate: original.toISOString() }));
    }

    setSelectDate('');
  }, [dispatch, selectDate])

  const dateRef = useRef<HTMLDivElement>(null);

  const scrollToSpecificDate = (date: string) => {
    console.log(date);
    
    setSelectDate(date);
  };

  const formattedDate = (date: Date) => format(date, 'EEE, MMM dd yyyy');

  const showDateLabel = (prevMessage: Message, message: Message) => {
    if (prevMessage) {
      return formattedDate(prevMessage.postedDate) !== formattedDate(message.postedDate);
    } else {
      return true;
    }
  }
  

  return (
    <>
          <Grid container spacing={4}>
              {messages.map((message, index) => (
                <Grid key={message.slackId} item xs={12}>
                  {
                  // !messagesLoaded ? (
                  //   <MessageListItemSkeleton />
                  // ) : 
                  (
                    <>
                      {showDateLabel(messages[index-1], message) && 
                        <>
                        {selectDate === formattedDate(message.postedDate) && <div ref={dateRef}></div>}
                        <DateFilters group={formattedDate(message.postedDate)} scrollToSpecificDate={scrollToSpecificDate}  />
                        </>
                      }
                      <MessageListItem message={message} />
                    </>
                  )}
                </Grid>
              ))}
          </Grid>
    </>
  );
}
