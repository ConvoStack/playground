import { ConvoStackEmbed, useConvoStack } from "convostack/frontend-react";
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
  defaultAgent?: string;
}

const WebPlayground: React.FC<WebPlaygroundProps> = ({
  embedContext,
  setEmbedContext,
  widgetContext,
  setWidgetContext,
  defaultAgent,
}) => {
  const {
    toggleWidgetWindow,
    isWidgetWindowVisible,
    openConversationList,
    openConversation,
    activeConversationId,
    embedActiveConversationId,
  } = useConvoStack();
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultAgent ? defaultAgent : "default"
  );
  console.log(defaultAgent, "sdfsdfsf", selectedValue);
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    openConversation(null, event.target.value, undefined, "test");
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

    !defaultAgent && fetchAgents();
  }, []);

  return (
    <div className="mx-4 mt-4">
      <Header />
      <div className="flex flex-row mt-4 border-1 rounded-md">
        <div className="flex flex-col w-80 border-r-1 pb-8 px-2">
          <p className="text-lg font-bold pt-5">Get Started</p>
          <p className="text-sm mt-4">
            {defaultAgent
              ? "Welcome to the ConvoStack Playground Repo with your own Langchain agent running live in the widget and embeddable chat component."
              : "Welcome to the ConvoStack Playground Repo. Here, you can try our developer playground that demonstrates some of the things you can do with the ConvoStack library."}
          </p>
          <p className="text-sm mt-4">
            {defaultAgent
              ? "Your Langchain agent is currently powered by ConvoStack's backend and frontend framework to create a production-ready chatbot."
              : "We encourage you to learn from this example or build upon it with your own AI models."}{" "}
            To deploy to production, visit our docs site{" "}
            <a
              href="https://docs.convostack.ai/production/deploy-with-fly-io"
              className="font-bold text-sky-400"
              target="_blank"
            >
              here.
            </a>{" "}
          </p>

          {defaultAgent && (
            <p className="text-sm mt-4">
              For more detailed documentation and information, visit the{" "}
              <a
                href="https://convostack.ai/"
                className="font-bold text-sky-400"
                target="_blank"
              >
                ConvoStack website.
              </a>{" "}
            </p>
          )}

          {!defaultAgent && (
            <>
              <p className="text-md font-bold mt-4">Some Tips</p>
              <Tips />
            </>
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className="border-b-1 pb-4 mb-4 flex flex-row items-center justify-between w-full">
            <p className="text-lg font-bold ml-4 pt-4">Playground</p>
            {!defaultAgent && (
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
            )}
          </div>
          <div className="flex flex-row ml-4 pb-4 w-full">
            <ConvoStackEmbed
              embedId="test"
              defaultAgent={selectedValue}
              customStyling={{
                embedWidth: "0px",
                embedHeight: "calc(100vh - 280px)",
                iconsColor: "white",
                headerTextColor: "white",
                embedFlex: "1 1 auto",
              }}
            />
            <div className="overflow-y-scroll h-[calc(100vh-280px)] w-80 mr-2">
              <div className="flex flex-col mx-4 ">
                <p className="font-bold text-sm border-b-1 mb-2 pb-2">
                  Widget Settings
                </p>
                <button
                  onClick={() => toggleWidgetWindow(!isWidgetWindowVisible)}
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
                  onClick={() => openConversation(null, selectedValue)}
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
                    openConversation(null, selectedValue, undefined, "test")
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
