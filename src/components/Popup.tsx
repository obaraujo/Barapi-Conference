"use client";

import * as Portal from "@radix-ui/react-portal";
import { ReactNode, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";

export function Popup({
  children,
  onClose,
  fullscreen = false,
}: {
  children: ReactNode;
  onClose: () => void;
  fullscreen?: boolean;
}) {
  const [positionY, setPositionY] = useState(0);
  const [positionBoundY, setPositionBoundY] = useState(0);
  const [heightPopup, setHeightPopup] = useState(0);
  const popup = useRef<HTMLElement | null>(null);

  function handleStop(e, data: DraggableData) {
    const heightWindow = window.innerHeight;

    if (heightWindow <= heightPopup / 2 + data.y) {
      setPositionY(heightWindow);
      onClose();
    } else if (data.y <= heightWindow - heightPopup && fullscreen) {
      popup.current.style.height = `${heightWindow}px`;
      setPositionBoundY(0);
      setPositionY(1);
    } else if (data.y <= heightPopup) {
      popup.current.style.height = `${heightPopup}px`;
      setPositionY(heightWindow - heightPopup);
      setPositionBoundY(heightWindow - heightPopup - 5);
    } else {
      const calc = heightWindow - heightPopup;
      setPositionY(heightWindow - heightPopup === 0 ? 1 : calc);
    }
  }

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    const heightPopup = popup.current.getBoundingClientRect().height;
    const heightWindow = window.innerHeight;

    setPositionY(heightWindow - heightPopup);
    setPositionBoundY(heightWindow - heightPopup - 5);

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [popup.current, heightPopup]);

  return (
    <Portal.Root>
      <div
        onClick={() => onClose()}
        className="bg-black/25 fixed inset-0 bottom-0 right-0 z-50"
      ></div>
      <Draggable
        axis="y"
        handle=".handle"
        defaultPosition={{ y: 1000, x: 0 }}
        position={positionY ? { y: positionY, x: 0 } : undefined}
        grid={[1, 1]}
        scale={1}
        onStop={handleStop}
        bounds={{ top: positionBoundY }}
      >
        <main
          ref={popup}
          onLoad={(e) => setHeightPopup(e.currentTarget.clientHeight)}
          style={{
            transition: "all 0.25s",
          }}
          className={`fixed p-4 top-0 left-0 right-0 z-50  bg-white rounded-tr-2xl rounded-tl-2xl border-t border-orange-barapi`}
        >
          <div className="handle w-full h-10 absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-400 w-20 h-3 rounded-full hover:bg-gray-300 transition-all cursor-pointer"></div>
          </div>
          <div className="mt-8 relative">{children}</div>
        </main>
      </Draggable>
    </Portal.Root>
  );
}
