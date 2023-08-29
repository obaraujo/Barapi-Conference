"use client";
import * as Portal from "@radix-ui/react-portal";
import { ReactNode, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

export function Popup({ children }: { children: ReactNode }) {
  const [positionY, setPositionY] = useState(0);
  const popup = useRef(null);

  function handleStop(e) {
    const { clientY: positionYPopup } = e.changedTouches[0];
    const heightPopup = popup.current.getBoundingClientRect().height;
    const heightWindow = window.innerHeight;

    if (heightWindow <= heightPopup / 2 + positionYPopup) {
      setPositionY(heightWindow);
    } else {
      setPositionY(heightWindow - heightPopup);
    }
  }

  useEffect(() => {
    const heightPopup = popup.current.getBoundingClientRect().height;
    const heightWindow = window.innerHeight;

    setPositionY(heightWindow - heightPopup);
  }, [children]);

  return (
    <Portal.Root>
      <Draggable
        axis="y"
        handle="#handle"
        defaultPosition={{ y: window.innerHeight, x: 0 }}
        position={positionY ? { y: positionY, x: 0 } : undefined}
        grid={[0, 1]}
        scale={1}
        onStop={handleStop}
      >
        <main
          ref={popup}
          style={{ transition: "all 0.25s" }}
          className="fixed p-4 top-0 left-0 right-0  bg-white rounded-tr-2xl rounded-tl-2xl border-t border-orange-barapi"
        >
          <div
            id="handle"
            className="bg-gray-500 w-20 h-3 mx-auto rounded-full mb-4 hover:bg-gray-300 transition-all cursor-pointer"
          ></div>
          {children}
        </main>
      </Draggable>
    </Portal.Root>
  );
}
