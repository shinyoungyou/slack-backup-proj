import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import useMessages from "@/hooks/useMessages";
import { useEffect } from "react";
import { fetchChannelsAsync } from "@/stores/channelsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { router } from "@/router/Routes";

function App() {
  const { channel } = useAppSelector((state) => state.channels);
  const dispatch = useAppDispatch();

  useMessages();

  useEffect(() => {
    dispatch(fetchChannelsAsync());
  }, [])

  useEffect(() => {
    if (channel) {
      router.navigate(`/${channel.name}/feed`);
    }
  }, [channel])


  return (
    <>
      <Outlet />
      <Navbar />
    </>
  );
}

export default App;
