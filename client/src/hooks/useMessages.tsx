import { useEffect } from "react";
import { messageSelectors, fetchMessagesAsync } from "@/stores/messagesSlice";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

export default function useMessages() {
  const messages = useAppSelector(messageSelectors.selectAll);
  const { messagesLoaded, messagesLoadTrigger } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (messagesLoadTrigger) dispatch(fetchMessagesAsync());
  }, [messagesLoadTrigger, dispatch]);

  return {
    messages,
    messagesLoaded,
    messagesLoadTrigger
  };
}
