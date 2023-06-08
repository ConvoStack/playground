import { ConvoStackWidget } from "convostack/frontend-react";
import Playgrounds from "./components/Playgrounds";

const App: React.FC = () => {
  return (
    <>
      <ConvoStackWidget
        graphqlUrl={import.meta.env.VITE_GRAPHQL_URL}
        websocketUrl={import.meta.env.VITE_WS_URL}
        customStyling={{
          headerText: "Hello, ConvoStack",
          headerTextColor: "white",
          iconsColor: "white",
          widgetLocation: "left",
        }}
      />
      <Playgrounds />
    </>
  );
};

export default App;
