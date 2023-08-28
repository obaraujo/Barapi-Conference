"use client";

import { useState } from "react";

export default function Page() {
  const [decodedResults, setDecodedResult] = useState("");

  return (
    <>
      <h1 className="text-sm">{decodedResults}</h1>
    </>
  );
}
