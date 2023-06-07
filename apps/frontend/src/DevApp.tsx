import { ConvoStackWidget } from "convostack/frontend-react";
import { useEffect, useState } from "react";
import Playgrounds from "./components/Playgrounds";

const DevApp: React.FC = () => {
  const [agentParam, setAgentParam] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setAgentParam(urlParams.get("agent") || "");
  }, []);

  return (
    <>
      {agentParam && (
        <>
          <ConvoStackWidget
            graphqlUrl={import.meta.env.VITE_GRAPHQL_URL}
            websocketUrl={import.meta.env.VITE_WS_URL}
            defaultAgent={agentParam}
            customStyling={{
              headerText: "Hello, ConvoStack",
              headerTextColor: "white",
              iconsColor: "white",
              widgetLocation: "left",
            }}
          />
          <Playgrounds defaultAgent={agentParam} />
        </>
      )}
    </>
  );
};

export default DevApp;
