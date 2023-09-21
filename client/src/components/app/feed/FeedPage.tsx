import { useEffect, useState, useRef } from "react";
import { Grid, Paper } from "@mui/material";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import {
  setLastId,
  setSelectedDate,
  setDirection
} from "@/stores/messagesSlice";
// import { AutoSizer, InfiniteLoader, List, WindowScroller } from "react-virtualized";

export default function FeedPage() {
  const { messagesLoaded, hasPrev, hasNext, messages } = useAppSelector(
    (state) => state.messages
  );
  const [loadingNext, setLoadingNext] = useState(false);
  const dispatch = useAppDispatch();
  const nextRef = useRef<HTMLDivElement>(null);

  const wheelPosition = useRef({ default: 0, move: 0, scroll: 0 });
  const scrollPosition = useRef({ default: 0 });
  const isCalled = useRef(false);

  useEffect(() => {
    if (messagesLoaded) {
      setLoadingNext(false);
      dispatch(setSelectedDate(""));
    }
  }, [messagesLoaded]);

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
      wheelPosition.current.move < -10 &&
      scrollPosition.current.default < 300 &&
      !isCalled.current
    ) {
      !loadingNext && hasPrev && handleGetPrev();
      isCalled.current = true;

      return;
    }

    if (wheelPosition.current.move > -10 && isCalled.current) {
      isCalled.current = false;

      return;
    }
  };

  return (
    <div onWheel={onWheel}>
      <MessageList />
      <div
        style={{ height: hasNext ? "300px" : "70px" }}
        ref={nextRef}
      ></div>
    </div>
  );
}
