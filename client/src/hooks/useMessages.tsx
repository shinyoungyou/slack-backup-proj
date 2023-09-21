import { useEffect, useState } from "react";
import { fetchMessagesAsync } from "@/stores/messagesSlice";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

export default function useMessages() {
  const { messagesLoaded, messages, messageParams } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();
  const [prevLastId, setPrevLastId] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState();


  useEffect(() => {
    // 현재 스크롤 위치를 저장합니다.
    // const currentScrollY = window.scrollY;

    let currentLastId = messageParams.lastId;
    if (!messagesLoaded && (prevLastId !== currentLastId || messages.length === 0 || messageParams.selectedDate)) {
      dispatch(fetchMessagesAsync());
      setPrevLastId(currentLastId);

      // 스크롤 위치를 조정하여 이전 페이지가 로딩되도록 합니다.
      // window.scrollTo({
      //   top: currentScrollY,
      //   behavior: "instant" as ScrollBehavior,
      // });
      // window.scrollTo(0, currentScrollY);
    };
  }, [messagesLoaded, messageParams.lastId]);

  return {
    messages,
    messagesLoaded,
  };
}
