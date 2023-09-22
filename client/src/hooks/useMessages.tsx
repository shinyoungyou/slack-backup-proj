import { useEffect, useState } from "react";
import { fetchMessagesAsync, resetMessages } from "@/stores/messagesSlice";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

export default function useMessages() {
  const { messagesLoaded, messages, messageParams } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();
  const [prevLastId, setPrevLastId] = useState<string>('');
  const [prevSearchTerm, setPrevSearchTerm] = useState<string | undefined>('');
  const [prevChannelId, setPrevChannelId] = useState<string | undefined>('');

  useEffect(() => {
    let currentLastId = messageParams.lastId;
    if (messageParams.channelId !== "" && !messagesLoaded 
        && (prevLastId !== currentLastId || messages.length === 0 
        || messageParams.selectedDate 
        || prevSearchTerm !== messageParams.search
        || prevChannelId !== messageParams.channelId)
      ) {
      if ((prevSearchTerm !== "" && messageParams.search === "") || (prevChannelId !== messageParams.channelId)) {
        dispatch(resetMessages());
      }
      dispatch(fetchMessagesAsync());
      setPrevLastId(currentLastId);
      setPrevSearchTerm(messageParams.search);
      setPrevChannelId(messageParams.channelId);
   
    };
  }, [messagesLoaded, messageParams]);

  return {
    messages,
    messagesLoaded,
  };
}
