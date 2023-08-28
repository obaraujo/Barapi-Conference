import { BarcodeScanner } from "@/components/Scanner";
import { ReactNode, createContext, useContext, useState } from "react";

interface ScannerProps {
  barcode: string;
  setActiveScanner: (state: boolean) => void;
}

const ContextScanner = createContext<ScannerProps>({} as ScannerProps);

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [barcode, setBarcode] = useState("");
  const [activeScanner, setActiveScanner] = useState(false);
  return (
    <ContextScanner.Provider value={{ barcode, setActiveScanner }}>
      <BarcodeScanner
        onRead={setBarcode}
        setActive={setActiveScanner}
        active={activeScanner}
      />
      {children}
    </ContextScanner.Provider>
  );
}

export function useScanner() {
  return useContext(ContextScanner);
}
