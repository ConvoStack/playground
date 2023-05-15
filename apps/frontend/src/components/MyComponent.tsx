import { useConvoStack } from "convostack/frontend-react";

interface MyComponentProps {
  text: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ text }) => {
    const {
    toggleWidget,
    isConversationWindowVisible,
    openConversationList,
    openConversation,
  } = useConvoStack();
  return (
    <div className="flex flex-col">
      <p className="text-black">{text}</p>
      <button
        onClick={() => toggleWidget(!isConversationWindowVisible)}
        className="bg-red-500 mb-8"
      >
        Toggle (open/close) widget
      </button>
      <button
        onClick={() => openConversationList()}
        className="bg-red-500 mb-8"
      >
        Open conversation list
      </button>
      <button
        onClick={() => openConversation(null)}
        className="bg-red-500 mb-8"
      >
        Start new chat (default agent)
      </button>
    </div>
  );
};

export default MyComponent;
