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
        headerText: "Hello, ConvoStack",
        headerTextColor: "white",
        iconsColor: "white",
        widgetLocation: "left",
      }}
    >
      <App />
    </ConvoStackWrapper>
  </>
);
