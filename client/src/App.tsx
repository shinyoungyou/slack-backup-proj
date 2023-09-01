import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import useMessages from "@/hooks/useMessages";
import { useAppDispatch, useAppSelector } from "@/stores/configureStore";
import { useState, useEffect } from "react";

function App() {
  useMessages();

  return (
    <>
      <Outlet />
      <Navbar />
    </>
  );
}

export default App;
