"use client";

import Quagga from "quagga-scanner";
import { useEffect, useRef, useState } from "react";

export function BarcodeScanner() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  useEffect(() => {
    Quagga.init(
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
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ["ean_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(function (result) {
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
  }, []);

  return (
    <div className="max-w-lg mx-auto max-h-[32rem] relative flex  flex-col gap-2">
      <div className="relative">
        <div
          className="relative viewport rounded-md overflow-hidden"
          id="interactive"
          ref={videoRef}
        ></div>
        <div className="border-4 rounded-2xl absolute z-10 top-1/4 bottom-1/4 left-[10%] right-[10%]"></div>
      </div>
      <button className="bg-orange-barapi text-white py-3 w-4/5 font-bold rounded-md mx-auto">
        Força check
      </button>
    </div>
  );
}
