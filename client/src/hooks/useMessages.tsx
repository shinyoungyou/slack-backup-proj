import { useEffect } from "react";
import { messageSelectors, fetchMessagesAsync } from "@/stores/messagesSlice";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

export default function useMessages() {
  const messages = useAppSelector(messageSelectors.selectAll);
  const { messagesLoaded } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!messagesLoaded) dispatch(fetchMessagesAsync());
  }, [messagesLoaded, dispatch]);

  return {
    messages,
    messagesLoaded,
  };
}
