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
    document.body.style.overflowY = "auto";
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

  function handleStart() {
    document.body.style.overflowY = "hidden";
  }

  useEffect(() => {
    const heightPopup = popup.current.getBoundingClientRect().height;
    const heightWindow = window.innerHeight;

    setPositionY(heightWindow - heightPopup);
    setPositionBoundY(heightWindow - heightPopup - 5);
    setHeightPopup(heightPopup);
  }, [children]);

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
        onStart={handleStart}
        bounds={{ top: positionBoundY }}
      >
        <main
          ref={popup}
          style={{
            transition: "all 0.25s",
            height: heightPopup ? heightPopup : null,
          }}
          className={`fixed p-4 top-0 left-0 right-0 z-50  bg-white rounded-tr-2xl rounded-tl-2xl border-t border-orange-barapi`}
        >
          <div className="handle bg-gray-400 w-20 h-3 mx-auto rounded-full mb-4 hover:bg-gray-300 transition-all cursor-pointer"></div>
          {children}
        </main>
      </Draggable>
    </Portal.Root>
  );
}
