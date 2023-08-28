import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { CameraDevice, Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

interface BarcodeScannerProps {
  onRead: (value: string) => void;
}

export function BarcodeScanner({ onRead }: BarcodeScannerProps) {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [cameraActiveId, setCameraActiveId] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scanRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    Html5Qrcode.getCameras().then((cameras) => {
      setDevices(cameras);
      const cameraActive = cameras.at(-1);

      if (cameraActive) setCameraActiveId(cameraActive.id);
    });

    scanRef.current = new Html5Qrcode("scanner_barapi", {
      useBarCodeDetectorIfSupported: true,
      verbose: false,
    });
  }, []);

  useEffect(() => {
    startScan();
  }, [cameraActiveId, scanRef.current]);

  async function startScan() {
    if (cameraActiveId && scanRef.current) {
      if (scanRef.current.isScanning) {
        await scanRef.current?.stop();
        scanRef.current?.clear();
        setIsScanning(false);
      }

      scanRef.current.start(
        { deviceId: cameraActiveId },
        {
          fps: 2,
          aspectRatio: window.innerHeight / window.innerWidth,
          qrbox: { height: 150, width: 350 },
        },
        (data) => {
          onRead(data);
          scanRef.current && scanRef.current.stop();
        },
        (e) => setIsScanning(!!scanRef.current?.isScanning)
      );
    }
  }

  return (
    <div className="fixed inset-0">
      <div id="scanner_barapi"></div>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="absolute top-4 right-4 z-50 rounded-full w-10 h-10 inline-flex items-center justify-center text-orange-barapi bg-white shadow-[0_2px_10px] shadow-[#00000044] hover:bg-orange-barapi hover:text-white focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none"
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
                  onChange={(e) => {
                    setCameraActiveId(e.currentTarget.value);
                  }}
                >
                  {devices.map((device) => (
                    <option
                      key={device.id}
                      value={device.id}
                      selected={cameraActiveId === device.id}
                    >
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
              {isScanning && scanRef.current?.isScanning && (
                <div>
                  {scanRef
                    .current!.getRunningTrackCameraCapabilities()
                    .torchFeature()
                    .isSupported() && (
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        id="flash"
                        onChange={(e) =>
                          scanRef.current
                            ?.getRunningTrackCameraCapabilities()
                            .torchFeature()
                            .apply(e.currentTarget.checked)
                        }
                      />
                      <label htmlFor="flash">Flash</label>
                    </div>
                  )}
                  {scanRef
                    .current!.getRunningTrackCameraCapabilities()
                    .zoomFeature()
                    .isSupported() && (
                    <div className="flex gap-1">
                      <input
                        onChange={(e) =>
                          scanRef.current
                            ?.getRunningTrackCameraCapabilities()
                            .zoomFeature()
                            .apply(parseFloat(e.currentTarget.value))
                        }
                        type="range"
                        min={scanRef
                          .current!.getRunningTrackCameraCapabilities()
                          .zoomFeature()
                          .min()}
                        max={scanRef
                          .current!.getRunningTrackCameraCapabilities()
                          .zoomFeature()
                          .max()}
                        step={scanRef
                          .current!.getRunningTrackCameraCapabilities()
                          .zoomFeature()
                          .step()}
                      />
                    </div>
                  )}
                </div>
              )}
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
  );
}
