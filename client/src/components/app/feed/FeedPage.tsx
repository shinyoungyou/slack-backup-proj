import { useEffect, useState, useRef } from 'react';
import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { setPageNumber, setMessageParams } from "@/stores/messagesSlice";
// import { AutoSizer, InfiniteLoader, List, WindowScroller } from "react-virtualized";

export default function FeedPage() {
  const { messagesLoaded, pagination } = useAppSelector((state) => state.messages);
  const [loadingNext, setLoadingNext] = useState(false);
  const dispatch = useAppDispatch();
  const nextRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (messagesLoaded) {      
      setLoadingNext(false);
      dispatch(setMessageParams({ selectedDate: '' }));
    }
  }, [messagesLoaded]);

  let hasMore = !loadingNext && !!pagination && pagination.currentPage < pagination.totalPages;

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
  }, [messagesLoaded, loadingNext, pagination]);

  function onIntersection([entry]: IntersectionObserverEntry[]){ 
    if (entry.isIntersecting && hasMore) {
      handleGetNext();
    }
  };

  function handleGetNext() {    
    setLoadingNext(true);
    dispatch(setPageNumber({ pageNumber: pagination!.currentPage + 1}));
  };

  return (
    <>
     {/* <div ref={prevRef}></div> */}
      <MessageList />
      <div style={{ height: pagination && pagination.currentPage < pagination.totalPages ? '300px' : '70px' }} ref={nextRef}></div>
    </>
  );
}
