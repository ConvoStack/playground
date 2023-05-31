import { ConvoStackEmbed, useConvoStack } from "convostack/frontend-react";
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Agents } from "../types/types";
import ContextInput from "./ContextInput";
import Header from "./Header";
import Tips from "./Tips";

interface MobilePlaygroundProps {
  embedContext: string;
  setEmbedContext: (arg: string) => void;
  widgetContext: string;
  setWidgetContext: (arg: string) => void;
}

const MobilePlayground: React.FC<MobilePlaygroundProps> = ({
  embedContext,
  setEmbedContext,
  widgetContext,
  setWidgetContext,
}) => {
  const {
    toggleWidgetWindow,
    isWidgetWindowVisible,
    openConversationList,
    openConversation,
    activeConversationId,
    embedActiveConversationId,
  } = useConvoStack();
  const [selectedValue, setSelectedValue] = useState<string>("default");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    openConversation(null, event.target.value, undefined, "test");
  };
  const [showTips, setShowTips] = useState(true);
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
      <div className="flex flex-col mt-4">
        {showTips && (
          <div className="flex flex-col pb-8 border-1 p-3 rounded-md mb-4">
            <div className="flex flex-row justify-between">
              <p className="text-lg font-bold">Get Started</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={"black"}
                width={24}
                height={24}
                onClick={() => setShowTips(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-sm mt-4">
              Welcome to the ConvoStack Playground Repo. Here, you can try our
              developer playground that demonstrates some of the things you can
              do with the ConvoStack library.{" "}
            </p>
            <p className="text-sm mt-4">
              We encourage you to learn from this example or build upon it with
              your own AI models. For more detailed documentation and
              information, visit the{" "}
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
        )}
        <div className="flex flex-col w-full">
          <div className="mb-4 flex flex-row items-center justify-between">
            <p className="text-lg font-bold">Playground</p>
            <div>
              {!loading && (
                <select
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className=" bg-white text-sm rounded-lg block pl-2 py-2.5 dark:placeholder-gray-400 focus:ring-0 focus:outline-none border-1"
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
          <div className="flex flex-col">
            <div className="border-1">
              <ConvoStackEmbed
                embedId="test"
                customStyling={{
                  embedWidth: "100%",
                  headerTextColor: "white",
                }}
              />
            </div>
            <div className="flex flex-col w-full">
              <p className="font-bold text-sm mb-2 pb-2 mt-4">
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
              <p className="font-bold text-sm mb-2 pb-2">Embed Settings</p>
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
  );
};

export default MobilePlayground;
