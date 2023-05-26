// @ts-ignore
import ReactDOM from "react-dom/client";
import "./index.css";
import { ConvoStackWrapper } from "convostack/frontend-react";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <ConvoStackWrapper
      graphqlUrl={import.meta.env.VITE_GRAPHQL_URL}
      websocketUrl={import.meta.env.VITE_WS_URL}
      customStyling={{
        // headerColor: "bg-black",
        headerText: "Hello, ConvoStack",
        headerTextColor: "text-white",
        iconsColor: "white",
        // widgetLaunchButtonColor: "bg-black",
        widgetLocation: "left",
      }}
    >
      <App />
    </ConvoStackWrapper>
  </>
);
