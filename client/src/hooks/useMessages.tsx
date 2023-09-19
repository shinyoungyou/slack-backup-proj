import { useEffect, useState } from "react";
import { messageSelectors, fetchMessagesAsync } from "@/stores/messagesSlice";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

export default function useMessages() {
  const messages = useAppSelector(messageSelectors.selectAll);
  const { messagesLoaded, messageLength } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();
  const [prevLastId, setPrevLastId] = useState<string>('');

  useEffect(() => {
    let currentLastId = messages[messages.length-1]?.id || '';
    if (!messagesLoaded && (prevLastId !== currentLastId || messages.length === 0)) {
      dispatch(fetchMessagesAsync());
      console.log("asdfasdf");
      setPrevLastId(currentLastId);
      
    };
    console.log("prevLastId: "+prevLastId);
    console.log("currentLastId: "+currentLastId);
  }, [messagesLoaded]);

  return {
    messages,
    messagesLoaded,
  };
}
