"use client";

import * as Portal from "@radix-ui/react-portal";
import { ReactNode, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";

export function Popup({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const [positionY, setPositionY] = useState(0);
  const [positionBoundY, setPositionBoundY] = useState(0);
  const [heightPopup, setHeightPopup] = useState(0);
  const popup = useRef(null);

  function handleStop(e, data: DraggableData) {
    const heightWindow = window.innerHeight;

    if (heightWindow <= heightPopup / 2 + data.y) {
      setPositionY(heightWindow);
      onClose();
    } else if (data.y <= heightWindow - heightPopup) {
      setHeightPopup(heightWindow);
      setPositionBoundY(0);
      setPositionY(1);
    } else {
      setPositionY(heightWindow - heightPopup);
    }
  }

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    const heightWindow = window.innerHeight;

    setPositionY(heightWindow - heightPopup);
    setPositionBoundY(heightWindow - heightPopup - 5);
    setHeightPopup(heightPopup);

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
            // height: heightPopup ? heightPopup : null,
          }}
          className={`fixed p-4 top-0 left-0 right-0 z-50  bg-white rounded-tr-2xl rounded-tl-2xl border-t border-orange-barapi`}
        >
          <div className="handle w-full h-8">
            <div className="bg-gray-400 w-20 h-3 mx-auto rounded-full hover:bg-gray-300 transition-all cursor-pointer"></div>
          </div>
          {children}
        </main>
      </Draggable>
    </Portal.Root>
  );
}
