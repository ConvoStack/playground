// @ts-ignore
import ReactDOM from "react-dom/client";
import "./index.css";
import { ConvoStackWrapper } from "convostack/frontend-react";
import MyComponent from "./components/MyComponent";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <ConvoStackWrapper
      graphqlUrl="http://localhost:3000/graphql"
      websocketUrl="ws://localhost:3000/graphql"
      userData={{
        email: "optional.user.email@example.com",
        name: "Optional Name",
        anonymousId: "",
        hash: "optional-id-verification-hash",
        externalId: "example-id-in-your-system",
      }}
      customStyling={{
        // headerColor: "bg-black",
        headerText: "Hello, ConvoStack",
        // widgetLaunchButtonColor: "bg-black",
        widgetLocation: "right",
        widgetWindowWidth: "w-[370px]",
      }}
    >
      <MyComponent text={"Your website's content"}></MyComponent>
    </ConvoStackWrapper>
  </>
);
