import { useState } from "react";
import MobilePlayground from "./MobilePlayground";
import WebPlayground from "./WebPlayground";

interface PlaygroundsProps {
  defaultAgent?: string;
}

const Playgrounds: React.FC<PlaygroundsProps> = ({ defaultAgent }) => {
  const [embedContext, setEmbedContext] = useState("");
  const [widgetContext, setWidgetContext] = useState("");
  return (
    <div>
      <div className="md:hidden">
        {/* Render AppMobile on small screens */}
        <MobilePlayground
          embedContext={embedContext}
          setEmbedContext={setEmbedContext}
          widgetContext={widgetContext}
          setWidgetContext={setWidgetContext}
          defaultAgent={defaultAgent}
        />
      </div>
      <div className="max-md:hidden">
        {/* Render App on larger screens */}
        <WebPlayground
          embedContext={embedContext}
          setEmbedContext={setEmbedContext}
          widgetContext={widgetContext}
          setWidgetContext={setWidgetContext}
          defaultAgent={defaultAgent}
        />
      </div>
    </div>
  );
};

export default Playgrounds;
