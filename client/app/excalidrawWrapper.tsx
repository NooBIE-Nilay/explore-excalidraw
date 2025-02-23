"use client";
import { Footer, MainMenu } from "@excalidraw/excalidraw";
import {
  ExcalidrawElement,
  Theme,
} from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import dynamic from "next/dynamic";
import { useState } from "react";

const ExcalidrawPrimitive = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

interface Element {
  id: number;
  element: ExcalidrawElement;
}
interface Flow {
  id: number;
  duration: number;
  elements: Set<Element>;
}
let newFlow: Flow = {} as unknown as Flow;
const Excalidraw = ({ theme }: { theme?: Theme }) => {
  const handleFlowStart = () => {
    if (flowState) return;
    newFlow.id = flows.length + 1;
    newFlow.duration = 500;
    newFlow.elements = new Set();
    setFlowState(true);
  };
  const handleFlowEnd = () => {
    if (!flowState) return;
    if (newFlow) {
      setFlows((flows) => {
        return [...flows, newFlow];
      });
    }
    setFlowState(false);
    newFlow = {} as unknown as Flow;
  };
  const [count, setCount] = useState(1);
  const [flowState, setFlowState] = useState(false);
  const [flows, setFlows] = useState<Flow[]>([]);
  //   const [newFlow, setNewFlow] = useState<Flow>();
  const [elements, setElements] = useState<ExcalidrawElement[]>([]);
  const [appState, setAppState] = useState<AppState | null>();
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  if (excalidrawAPI)
    excalidrawAPI.onPointerUp(() => {
      //TODO: Think about this logic to get better result!
      const updatedElements = excalidrawAPI.getSceneElements();
      const newElement = new Set(updatedElements).difference(new Set(elements));
      setElements([...updatedElements]);
      if (flowState && newElement) {
        // newFlow.elements.add({
        //   id: count,
        //     element:
        // });
        setCount(count + 1);
        console.log(newFlow);
      }
    });
  return (
    <div className="relative h-[calc(100svh-72px)] overflow-hidden">
      <ExcalidrawPrimitive
        theme={theme}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        // initialData={{ elements, appState }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Item onSelect={handleFlowStart}>Flow Start</MainMenu.Item>
          <MainMenu.Item onSelect={handleFlowEnd}>Flow End</MainMenu.Item>
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
        <Footer>
          <div className="flex justify-center items-center">
            {flowState && (
              <div className="bg-green-400 w-4 h-4 rounded-lg"></div>
            )}
          </div>
        </Footer>
      </ExcalidrawPrimitive>
    </div>
  );
};

export default Excalidraw;
