import { useEffect, useState, useRef } from 'react';
import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { setLastId, setSelectedDate, messageSelectors } from "@/stores/messagesSlice";
// import { AutoSizer, InfiniteLoader, List, WindowScroller } from "react-virtualized";

export default function FeedPage() {
  const { messagesLoaded, bringMorePosts } = useAppSelector((state) => state.messages);
  const [loadingNext, setLoadingNext] = useState(false);
  const messages = useAppSelector(messageSelectors.selectAll);
  const dispatch = useAppDispatch();
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesLoaded) {      
      setLoadingNext(false);
      dispatch(setSelectedDate(''));
    }
  }, [messagesLoaded]);

  let hasMore = !loadingNext && bringMorePosts;

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    if (!hasMore && observer) {
      return observer && observer.disconnect();
    }

    if (observer && nextRef.current) {
      observer.observe(nextRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    }
  }, [messagesLoaded, loadingNext, bringMorePosts]);

  function onIntersection([entry]: IntersectionObserverEntry[]){ 
    if (entry.isIntersecting && hasMore) {
      handleGetNext();
    }
  };

  function handleGetNext() {    
    setLoadingNext(true);
    if (messages.length > 0) {
      dispatch(setLastId(messages[messages.length-1].id));
    }
  };


  // function handleGetPrev() {    
  //   setLoadingNext(true);
  //   dispatch(setLastId(messages[0]));
  // };

  return (
    <>
     {/* <div ref={prevRef}></div> */}
      <MessageList />
      <div style={{ height: bringMorePosts ? '300px' : '70px' }} ref={nextRef}></div>
    </>
  );
}
