import { createBrowserRouter, RouteObject, Navigate } from "react-router-dom";

import FeedPage from "@/components/app/feed/FeedPage";
// import DetailPage from "@/components/app/detail/DetailPage";
import App from "@/App";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Navigate to="feed" /> },
      // { path: "", element: <Navigate to=":channelName/feed" /> },
      { path: "feed", element: <FeedPage /> },
      { 
        path: ":channelName",
        children: [
          { path: "feed", element: <FeedPage /> },
        ] 
      },
      // { path: "details/:messageId", element: <DetailPage /> },
      // { path: "not-found", element: <NotFound /> },
      // { path: "server-error", element: <ServerError /> },
      // {path: '*', element: <Navigate replace to='/not-found' />},
    ],
  },
];

export const router = createBrowserRouter(routes);