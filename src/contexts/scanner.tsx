import { PopupConfirmProduct } from "@/components/PopupConfirmProduct";
import { BarcodeScanner } from "@/components/Scanner";
import { ReactNode, createContext, useContext, useState } from "react";
import { OrderProductProps } from "./order";

interface ScannerProps {
  productFetched: OrderProductProps;
  setProductFetched: (product: OrderProductProps) => void;
}

const ContextScanner = createContext<ScannerProps>({} as ScannerProps);

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [barcode, setBarcode] = useState("");
  const [productFetched, setProductFetched] =
    useState<OrderProductProps | null>(null);

  return (
    <ContextScanner.Provider value={{ setProductFetched, productFetched }}>
      <BarcodeScanner onRead={setBarcode} />
      {productFetched && productFetched.bar_code === barcode && (
        <PopupConfirmProduct product={productFetched} />
      )}
      {children}
    </ContextScanner.Provider>
  );
}

export function useScanner() {
  return useContext(ContextScanner);
}
