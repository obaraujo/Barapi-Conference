"use client";

import { BarcodeScanner } from "@/components/Scanner";
import { useState } from "react";

export default function Page() {
  const [decodedResults, setDecodedResult] = useState("");

  return (
    <>
      <BarcodeScanner onRead={setDecodedResult} />
      <h1 className="text-sm">{decodedResults}</h1>
    </>
  );
}
