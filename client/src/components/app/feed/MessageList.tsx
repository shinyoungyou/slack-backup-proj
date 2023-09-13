import { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useAppSelector } from "@/stores/configureStore";
import MessageListItem from "./MessageListItem";
import MessageListItemSkeleton from "./MessageListItemSkeleton";
import DateFilters from "./DateFilters";
import { messageSelectors } from "@/stores/messagesSlice";
import {
  CellMeasurer,
} from "react-virtualized";
import { Message } from "@/models/message";
import { format } from 'date-fns';

interface Props {
  keyProp: string;
  cache: any;
  index: number;
  style: any;
  parent: any;
  selectDate: string;
  setSelectDate: any;
  dateExists: boolean[]; 
  setDateExists: any;
  theSelectedDate: string;
}

export default function MessageList({ theSelectedDate, keyProp, cache, index, style, parent, selectDate, setSelectDate, dateExists, setDateExists }: Props) {
  const { messagesLoaded } = useAppSelector((state) => state.messages);
  const messages = useAppSelector(messageSelectors.selectAll);
  const [idk, setIdk] = useState<boolean>(false);
  const dateRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (dateRef.current) {
      const yOffset = dateRef.current?.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        behavior: "smooth",
        top: yOffset,
      });
    }

    setSelectDate('');
  }, [idk])

  useEffect(() => {
    setIdk(theSelectedDate === formattedDate(message.postedDate));
  }, [theSelectedDate])

  const scrollToSpecificDate = (date: string) => {
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

  const message = messages[index];

  useEffect(() => {
    if (selectDate !== '' && messages.length > 0) {
      setDateExists((prev: boolean[]) => { 
        return [...prev, selectDate === formattedDate(message.postedDate)]
      });
    }
  }, [selectDate, messages.length])

  return (
    <CellMeasurer
      key={keyProp}
      cache={cache.current}
      parent={parent}
      columnIndex={0}
      rowIndex={index}>
          <Grid container rowSpacing={4} style={style}>
              {/* {messages.map((message, index) => ( */}
                <Grid key={message.slackId} item xs={12}>
                  {!messagesLoaded ? (
                    <MessageListItemSkeleton />
                  ) : (
                    <>
                      {showDateLabel(messages[index-1], message) && 
                        <>
                        {idk && <div ref={dateRef}></div>}
                        {/* {selectDate === formattedDate(message.postedDate) && <div ref={dateRef}></div>} */}
                        <DateFilters group={formattedDate(message.postedDate)} scrollToSpecificDate={scrollToSpecificDate} setDateExists={setDateExists} />
                        </>
                      }
                      <MessageListItem message={message} />
                    </>
                  )}
                </Grid>
              {/* ))} */}
          </Grid>
    </CellMeasurer>
  );
}
