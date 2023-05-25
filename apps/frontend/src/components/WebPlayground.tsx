import { EmbedChat, useConvoStack } from "convostack/frontend-react";
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Agents } from "../types/types";
import ContextInput from "./ContextInput";
import Header from "./Header";
import Tips from "./Tips";

interface WebPlaygroundProps {
  embedContext: string;
  setEmbedContext: (arg: string) => void;
  widgetContext: string;
  setWidgetContext: (arg: string) => void;
}

const WebPlayground: React.FC<WebPlaygroundProps> = ({
  embedContext,
  setEmbedContext,
  widgetContext,
  setWidgetContext,
}) => {
  const {
    toggleWidget,
    isConversationWindowVisible,
    openConversationList,
    openConversation,
    activeConversationId,
    embedActiveConversationId,
  } = useConvoStack();
  const [selectedValue, setSelectedValue] = useState<string>("default");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };
  const [agents, setAgents] = useState<Agents[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axiosInstance.get("/agents");
        const agentsData = response.data;
        setAgents(agentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="mx-4 mt-4">
      <Header />
      <div className="flex flex-row mt-4 border-1 rounded-md">
        <div className="flex flex-col w-96 border-r-1 pb-8 px-2">
          <p className="text-lg font-bold pt-5">Get Started</p>
          <p className="text-sm mt-4">
            Welcome to the ConvoStack "Getting Started" Repo. Here, you can try
            our developer playground that demonstrates some of the things you
            can do with the ConvoStack library.{" "}
          </p>
          <p className="text-sm mt-4">
            We encourage you to learn from this example or build upon it with
            your own AI models. For more detailed documentation and information,
            visit the{" "}
            <a
              href="https://convostack.ai/"
              className="font-bold text-sky-400"
              target="_blank"
            >
              ConvoStack website.
            </a>{" "}
          </p>
          <p className="text-md font-bold mt-4">Some Tips</p>
          <Tips />
        </div>
        <div className="flex flex-col w-full">
          <div className="border-b-1 pb-4 mb-4 flex flex-row items-center justify-between">
            <p className="text-lg font-bold ml-4 pt-4">Playground</p>
            <div className="mr-4 mt-4">
              {!loading && (
                <select
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="border border-gray-300 bg-white text-sm rounded-lg block w-48 pl-2 py-2.5 dark:placeholder-gray-400 focus:ring-0 focus:outline-none"
                >
                  {agents.map((agent) => (
                    <option key={agent.key} value={agent.key}>
                      {agent.displayName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="flex flex-row ml-4">
            <EmbedChat
              id="test"
              customStyling={{
                embedWidth: "w-full",
                embedHeight: "h-96",
                iconsColor: "white",
                headerTextColor: "text-white",
              }}
            />
            <div className="overflow-y-scroll h-96 w-96">
              <div className="flex flex-col mx-4 ">
                <p className="font-bold text-sm border-b-1 mb-2 pb-2">
                  Widget Settings
                </p>
                <button
                  onClick={() => toggleWidget(!isConversationWindowVisible)}
                  className="bg-neutral-300 mb-2 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
                >
                  Toggle
                </button>
                <button
                  onClick={() => openConversationList()}
                  className="bg-neutral-300 mb-2 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
                >
                  Open Conversation List
                </button>
                <button
                  onClick={() => openConversation(null)}
                  className="bg-neutral-300 mb-2 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
                >
                  Open New Conversation
                </button>
                <ContextInput
                  context={widgetContext}
                  setContext={setWidgetContext}
                  conversationId={activeConversationId}
                />
                <p className="font-bold text-sm border-b-1 mb-2 pb-2">
                  Embed Settings
                </p>
                <button
                  onClick={() => openConversationList("test")}
                  className="bg-neutral-300 mb-2 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
                >
                  Open Conversation List
                </button>
                <button
                  onClick={() =>
                    openConversation(null, undefined, undefined, "test")
                  }
                  className="bg-neutral-300 mb-2 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
                >
                  Open New Conversation
                </button>
                <ContextInput
                  context={embedContext}
                  setContext={setEmbedContext}
                  conversationId={embedActiveConversationId["test"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebPlayground;
