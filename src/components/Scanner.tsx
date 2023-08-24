"use client";

import Quagga from "quagga-scanner";
import { useEffect, useRef, useState } from "react";

export const BarcodeScanner = () => {
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
            left: "25%",
            right: "25%",
            bottom: "25%",
          },
          constraints: {
            width: 640,
            height: 480,
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

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        // if (result.boxes) {
        //   drawingCtx.clearRect(
        //     0,
        //     0,
        //     parseInt(drawingCanvas.getAttribute("width")),
        //     parseInt(drawingCanvas.getAttribute("height"))
        //   );
        //   result.boxes
        //     .filter(function (box) {
        //       return box !== result.box;
        //     })
        //     .forEach(function (box) {
        //       Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
        //         color: "#ff4f00",
        //         lineWidth: 6,
        //       });
        //     });
        // }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

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

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className="relative viewport"
          id="interactive"
          ref={videoRef}
        ></div>
        <div className="border-2 absolute z-10 top-1/4 bottom-1/4 left-1/4 right-1/4"></div>
      </div>
      <span>{barcode}</span>
    </>
  );
};
