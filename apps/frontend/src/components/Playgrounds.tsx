import { useState } from "react";
import MobilePlayground from "./MobilePlayground";
import WebPlayground from "./WebPlayground";

const Playgrounds: React.FC = () => {
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
        />
      </div>
      <div className="max-md:hidden">
        {/* Render App on larger screens */}
        <WebPlayground
          embedContext={embedContext}
          setEmbedContext={setEmbedContext}
          widgetContext={widgetContext}
          setWidgetContext={setWidgetContext}
        />
      </div>
    </div>
  );
};

export default Playgrounds;
