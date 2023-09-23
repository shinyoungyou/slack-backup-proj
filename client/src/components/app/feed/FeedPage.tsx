import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { setLastId, setSelectedDate, setDirection } from "@/stores/messagesSlice";
import MessageListItemSkeleton from "./MessageListItemSkeleton";
import MessageSearch from "./MessageSearch";
import { useParams } from "react-router-dom";
import { setChannel } from "@/stores/channelsSlice";
import { setChannelIdParam } from "@/stores/messagesSlice";

export default function FeedPage() {
  const { messagesLoaded, messageParams, hasPrev, hasNext, messages } = useAppSelector((state) => state.messages);
  const { channels, channel } = useAppSelector((state) => state.channels);
  const [loadingNext, setLoadingNext] = useState(false);
  const dispatch = useAppDispatch();
  const nextRef = useRef<HTMLDivElement>(null);

  const wheelPosition = useRef({ default: 0, move: 0, scroll: 0 });
  const scrollPosition = useRef({ default: 0 });
  const isCalled = useRef(false);
  const { channelName } = useParams();

  useEffect(() => {
    if (messagesLoaded) {
      setLoadingNext(false);
      dispatch(setSelectedDate(""));
    }
  }, [messagesLoaded]);

  useEffect(() => {    
    const selectedChannel = channels.find(channel => channel.name === channelName);
    
    if (selectedChannel) {
      dispatch(setChannel(selectedChannel));
      dispatch(setChannelIdParam(selectedChannel.slackId));
    }
  }, [channelName, channels, dispatch]) 

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    if (loadingNext && !hasNext && observer) {
      return observer && observer.disconnect();
    }

    if (observer && nextRef.current) {
      observer.observe(nextRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [messagesLoaded, loadingNext, hasNext]);

  useEffect(() => {
    const handleScrollEvent = () => {
      scrollPosition.current.default = window.scrollY;
    };

    window.addEventListener("scroll", handleScrollEvent);

    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  function onIntersection([entry]: IntersectionObserverEntry[]) {
    if (entry.isIntersecting && !loadingNext && hasNext) {
      handleGetNext();
    }
  }

  function handleGetNext() {
    dispatch(setDirection('next'));
    setLoadingNext(true);
    if (messages.length > 0) {
      dispatch(setLastId(messages[messages.length - 1].id));
    }
  }

  function handleGetPrev() {
    dispatch(setDirection('prev'));
    setLoadingNext(true);

    dispatch(setLastId(messages[0].id));
  };

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    wheelPosition.current.move = event.deltaY;

    if (
      wheelPosition.current.move < -7 &&
      scrollPosition.current.default < 500 &&
      !isCalled.current
    ) {
      !loadingNext && hasPrev && handleGetPrev();
      isCalled.current = true;

      return;
    }

    if (wheelPosition.current.move > -7 && isCalled.current) {
      isCalled.current = false;

      return;
    }
  };

  return (
    <>
      {channel ?
        <div onWheel={onWheel}>
          <MessageSearch />
          <MessageList />
          {messages.length > 0 && !messagesLoaded && <MessageListItemSkeleton />}
          <div
            style={{ height: hasNext ? "300px" : "70px" }}
            ref={nextRef}
          ></div>
          {messages.length === 0 && messageParams?.search !== "" && "No search results found"}
        </div> 
        :
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
        >
          <Typography>select a channel</Typography> 
        </Box>
        }
    </>
  );
}
