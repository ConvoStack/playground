// @ts-ignore
import ReactDOM from "react-dom/client";
import "./index.css";
import { ConvoStackWrapper } from "convostack/frontend-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DevApp from "./DevApp";
// import NewApp from "./NewApp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dev",
    element: <DevApp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConvoStackWrapper>
    <RouterProvider router={router} />
  </ConvoStackWrapper>
);
