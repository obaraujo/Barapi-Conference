"use client";
import Quagga from "quagga";
import { useEffect, useReducer, useRef, useState } from "react";

import { QuaggaJSConfigObject } from "@/types/quagga";
import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import "./styles.css";

interface actionScannerConfigProps {
  name: "deviceId" | "aspectRatio";
  payload: any;
}

export function BarcodeScanner() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [scannerConfig, dispatch] = useReducer(
    (state: QuaggaJSConfigObject, action: actionScannerConfigProps) => {
      let newState: QuaggaJSConfigObject = {} as QuaggaJSConfigObject;
      switch (action.name) {
        case "deviceId":
          newState = {
            ...state,
            inputStream: {
              ...state.inputStream,
              constraints: {
                ...state.inputStream.constraints,
                deviceId: action.payload,
              },
            },
          };
          break;
        case "aspectRatio":
          newState = {
            ...state,
            inputStream: {
              ...state.inputStream,
              constraints: {
                ...state.inputStream.constraints,
                aspectRatio: action.payload,
              },
            },
          };
          break;
      }
      return newState;
    },
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: videoRef.current,
        area: {
          top: "25%",
          bottom: "25%",
          left: "10%",
          right: "10%",
        },
        constraints: {
          width: { min: 30 },
          height: { min: 40 },
          facingMode: "environment",
          aspectRatio: window.innerHeight / window.innerWidth,
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      numOfWorkers: 2,
      frequency: 10,
      decoder: {
        readers: [
          {
            format: "code_128_reader",
            config: { supplements: [] },
          },
        ],
      },
      locate: true,
    }
  );
  const [devices, setDevices] = useState<{ name: string; id: string }[]>([]);
  const [capabilities, setCapabilities] = useState({});
  const [flash, setFlash] = useState([]);
  console.log(devices);

  useEffect(() => {
    Quagga.CameraAccess.enumerateVideoDevices().then(function (devices) {
      setDevices(
        devices.map((device) => {
          return {
            name: device.label || device.deviceId,
            id: device.deviceId,
          };
        })
      );
    });

    dispatch({
      name: "aspectRatio",
      payload: window.innerHeight / window.innerWidth,
    });
  }, []);

  useEffect(() => {
    Quagga.init(scannerConfig, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      var track = Quagga.CameraAccess.getActiveTrack();
      var capabilities = {};
      if (typeof track.getCapabilities === "function") {
        capabilities = track.getCapabilities();
      }
      // track.applyConstraints({advanced: [{torch: false}]})
      //track.applyConstraints({advanced: [{zoom: parseFloat(value)}]});

      Quagga.start();

      setCapabilities(capabilities);
    });

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }
        console.log(result);

        if (result.codeResult && result.codeResult.code) {
          setBarcode(result.codeResult.code);
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(function (result: any) {
      if (result) {
        if (result.codeResult && result.codeResult.code) {
          setBarcode(result.codeResult.code);
          console.log(result.codeResult.code);
        }
      }
    });

    return () => {
      Quagga.stop();
    };
  }, [scannerConfig]);

  function handleFlash(state: boolean) {
    const track = Quagga.CameraAccess.getActiveTrack();
    // track.applyConstraints({ advanced: [{ deviceId: state }] });
  }

  function handleSelectDevice(deviceId: string) {
    dispatch({ name: "deviceId", payload: deviceId });
  }

  return (
    <div className="mx-auto relative flex  flex-col gap-2">
      <div className="relative">
        <div
          className="relative viewport rounded-md overflow-hidden"
          id="interactive"
          ref={videoRef}
        ></div>
        <div className="border-4 rounded-2xl absolute z-10 top-1/4 bottom-1/4 left-[10%] right-[10%]">
          {barcode}
        </div>
        <button className="bg-black text-white py-3 w-4/5 font-bold rounded-md mx-auto">
          Força check
        </button>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className="absolute top-4 right-4 z-50 rounded-full w-10 h-10 inline-flex items-center justify-center text-violet11 bg-white shadow-[0_2px_10px] shadow-[#00000044] hover:bg-[#ff4f00] hover:text-white focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none"
              aria-label="Update dimensions"
            >
              <MixerHorizontalIcon />
            </button>
          </Popover.Trigger>
          <Popover.Portal className="">
            <Popover.Content
              className="rounded p-5 w-[260px] relative z-50 bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
              sideOffset={5}
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <select
                    className="px-2 py-2 rounded-md"
                    id="devices"
                    onChange={(e) => handleSelectDevice(e.currentTarget.value)}
                  >
                    {devices.map((device) => {
                      return (
                        <option key={device.id} value={device.id}>
                          {device.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex gap-1">
                  <input
                    type="checkbox"
                    id="flash"
                    onChange={(e) => handleFlash(e.currentTarget.checked)}
                  />
                  <label htmlFor="flash">Flash</label>
                </div>
              </div>
              <Popover.Close
                className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
                aria-label="Close"
              >
                <Cross2Icon />
              </Popover.Close>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
