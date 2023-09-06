"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ScannerProps {
  activeScanner: boolean;
  setActiveScanner: (state: boolean) => void;
}

const ContextScanner = createContext<ScannerProps>({} as ScannerProps);

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [activeScanner, setActiveScanner] = useState<boolean>(false);

  return (
    <ContextScanner.Provider
      value={{
        activeScanner,
        setActiveScanner,
      }}
    >
      {children}
    </ContextScanner.Provider>
  );
}

export function useScanner() {
  return useContext(ContextScanner);
}
