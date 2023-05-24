import { EmbedChat, useConvoStack } from "convostack/frontend-react";
import { ChangeEvent, useState } from "react";

const App: React.FC = () => {
  const {
    toggleWidget,
    isConversationWindowVisible,
    openConversationList,
    openConversation,
    updateContext,
    activeConversationId,
  } = useConvoStack();
  const [selectedValue, setSelectedValue] = useState("LOL");
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };
  console.log(import.meta.env.VITE_GRAPHQL_URL);

  return (
    <div className="mx-4 mt-4">
      <div className="flex flex-row">
        <img src="/convostacklogo.png" className="w-8 h-8 mr-1" />
        <p className="font-semibold text-2xl ml-1">ConvoStack</p>
      </div>

      <div className="flex flex-row mt-4 border-1 rounded-md">
        <div className="flex flex-col w-1/4 border-r-1 pb-8 px-2">
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
          <div className="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mt-3 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>

            <p className="text-sm mt-4">
              Before creating a new conversation, load an agent.
            </p>
          </div>
          <div className="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mt-3 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
              />
            </svg>
            <p className="text-sm mt-4">
              Updating context will only apply to the conversation that is
              selected.
            </p>
          </div>
          <div className="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 mt-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>

            <p className="text-sm mt-4">Have fun!</p>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="border-b-1 pb-4 mb-4 flex flex-row items-center justify-between">
            <p className="text-lg font-bold ml-4 pt-4">Playground</p>
            <div className="mr-4 mt-4">
              <select
                value={selectedValue}
                onChange={handleSelectChange}
                className="border border-gray-300 bg-white text-sm rounded-lg block w-48 pl-2 py-2.5 dark:placeholder-gray-400 focus:ring-0 focus:outline-none"
              >
                <option value={"LOL"}>Load an agent...</option>
                <option value="Default">Default</option>
                <option value="OpenAI">OpenAI</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row ml-4">
            <EmbedChat
              id="test"
              customStyling={{ embedWidth: "w-3/4", embedHeight: "h-96" }}
            />
            <div className="flex flex-col mx-4 w-1/4">
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
              <button
                onClick={() =>
                  activeConversationId
                    ? updateContext(activeConversationId, {
                        example: "example",
                      })
                    : null
                }
                className="bg-neutral-300 mb-8 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
              >
                Update Context
              </button>
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
              <button
                onClick={() =>
                  activeConversationId
                    ? updateContext(activeConversationId, {
                        example: "example",
                      })
                    : null
                }
                className="bg-neutral-300 mb-2 text-sm rounded-md mt-2 p-1 hover:bg-neutral-400"
              >
                Update Context
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
