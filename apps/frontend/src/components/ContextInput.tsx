import { useConvoStack } from "convostack/frontend-react";
import { useState } from "react";

interface ContextInputProps {
  context: string;
  setContext: (arg: string) => void;
  conversationId: string | null;
}

const ContextInput: React.FC<ContextInputProps> = ({
  setContext,
  context,
  conversationId,
}) => {
  const { updateContext } = useConvoStack();
  const [showContextInputError, setShowContextInputError] = useState(false);
  const [showConversationIdError, setShowConversationIdError] = useState(false);
  const isValidJSON = (jsonString: string) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  };
  const handleContextSubmit = () => {
    if (isValidJSON(context)) {
      setShowContextInputError(false);
      if (conversationId) {
        setShowConversationIdError(false);
        updateContext(conversationId, JSON.parse(context));
      } else {
        setShowConversationIdError(true);
      }
    } else {
      setShowContextInputError(true);
    }
  };
  return (
    <>
      <div className="border-1 rounded-md mt-2">
        <div className="relative">
          <textarea
            rows={3}
            className="overflow-auto resize-none w-full rounded p-2 text-sm focus:ring-0 focus:outline-none"
            placeholder={`{\n   "Example": "Context"\n}`}
            onChange={(event) => setContext(event.target.value)}
            value={context}
          />
        </div>
        <div className="flex justify-end border-t-1 py-2 rounded-b-md">
          <button
            onClick={handleContextSubmit}
            className="bg-neutral-300 text-sm rounded-md p-1 hover:bg-neutral-400 w-1/2 mr-1"
          >
            Update Context
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-end items-end">
        {showContextInputError && (
          <p className="text-xs mt-1 text-red-500">
            Error: Context must be a JSON object.
          </p>
        )}
        {showConversationIdError && (
          <p className="text-xs mt-1 text-red-500">
            Error: A conversation must be selected.
          </p>
        )}
        <p className="text-xs mb-8 mt-1 text-gray-500">
          Note: Not all models support context.
        </p>
      </div>
    </>
  );
};

export default ContextInput;
