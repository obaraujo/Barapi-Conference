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
  const elementScroll = useRef<HTMLDivElement | null>(null);

  function handleStop(e, data: DraggableData) {
    addNotDrag();

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

    if (heightPopup >= window.innerHeight) {
      setPositionY(1);
    } else {
      setPositionY(heightWindow - heightPopup);
    }

    setPositionBoundY(heightWindow - heightPopup - 5);
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [popup.current, heightPopup]);

  useEffect(() => {
    history.pushState({}, "popup");

    setHeight(popup.current.getBoundingClientRect().height);
    addNotDrag();

    const handleBackButton = () => {
      onClose();
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  function setHeight(height: number) {
    if (height >= window.innerHeight) {
      setHeightPopup(window.innerHeight - 1);
    } else {
      setHeightPopup(height);
    }
  }

  function addNotDrag() {
    const scrollMax =
      elementScroll.current.scrollHeight - elementScroll.current.clientHeight;

    if (scrollMax > 0) {
      elementScroll.current.classList.add("not-drag");
    }
  }

  function handleScroll() {
    const scrollTop = elementScroll.current.scrollTop;
    const scrollMax =
      elementScroll.current.scrollHeight - elementScroll.current.clientHeight;
    if (scrollTop === 0 || scrollMax === scrollTop) {
      elementScroll.current.classList.remove("not-drag");
    } else {
      elementScroll.current.classList.add("not-drag");
    }
  }

  return (
    <Portal.Root>
      <div
        onClick={() => onClose()}
        className="bg-black/25 fixed inset-0 bottom-0 right-0 z-50"
      ></div>
      <Draggable
        axis="y"
        handle=".handle"
        cancel=".not-drag, input, button"
        defaultPosition={{ y: 1000, x: 0 }}
        position={positionY ? { y: positionY, x: 0 } : undefined}
        grid={[1, 1]}
        scale={1}
        onStop={handleStop}
        bounds={{ top: positionBoundY }}
      >
        <main
          ref={popup}
          onLoad={(e) => setHeight(e.currentTarget.clientHeight)}
          style={{
            transition: "all 0.25s",
          }}
          className={`fixed handle p-4 top-0 left-0 right-0 z-50 overflow-hidden  bg-white rounded-tr-2xl rounded-tl-2xl border-t border-orange-barapi`}
        >
          <div
            className=" w-full h-10 absolute z-20 inset-0 flex items-center justify-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(255, 255, 255) 75%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <div className="bg-gray-400 w-20 h-3 rounded-full hover:bg-gray-300 transition-all cursor-pointer"></div>
          </div>
          <div
            ref={elementScroll}
            onTouchEnd={handleScroll}
            className="pt-8 relative inset-0 z-10 scrollbar-hidden md:scrollbar-show max-h-[calc(100vh-50px)] overflow-y-auto pb-4"
          >
            {children}
          </div>
        </main>
      </Draggable>
    </Portal.Root>
  );
}
