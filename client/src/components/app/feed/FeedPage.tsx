import { useEffect, useState } from 'react';
import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import InfiniteScroll from "react-infinite-scroller";
import { setPageNumber } from "@/stores/messagesSlice";

export default function FeedPage() {
  const { messagesLoaded, pagination } = useAppSelector((state) => state.messages);
  const [loadingNext, setLoadingNext] = useState(false);
  const dispatch = useAppDispatch();

  function handleGetNext() {
    setLoadingNext(true);
    dispatch(setPageNumber({ pageNumber: pagination!.currentPage + 1}));
  }

  useEffect(() => {
    if (messagesLoaded) {
      setLoadingNext(false)
    }
  }, [messagesLoaded]);

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={
          !loadingNext &&
          !!pagination &&
          pagination.currentPage < pagination.totalPages
        }
        initialLoad={false}
      >
        <MessageList />
      </InfiniteScroll>
    </>
  );
}
