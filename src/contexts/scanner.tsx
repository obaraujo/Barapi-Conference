import { Popup } from "@/components/Popup";
import { PopupConfirmProduct } from "@/components/PopupConfirmProduct";
import { PopupIncorrectProduct } from "@/components/PopupIncorrectProduct";
import { BarcodeScanner } from "@/components/Scanner";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { OrderProductProps } from "./order";

interface ScannerProps {
  productFetched: OrderProductProps;
  setProductFetched: (product: OrderProductProps) => void;
  activeScanner: boolean;
  setActiveScanner: (state: boolean) => void;
}

const ContextScanner = createContext<ScannerProps>({} as ScannerProps);

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [barcode, setBarcode] = useState("");
  const [activeScanner, setActiveScanner] = useState(false);
  const [productFetched, setProductFetched] =
    useState<OrderProductProps | null>(null);

  function handleClose() {
    setProductFetched(null);
  }

  useEffect(() => {
    if (productFetched && productFetched.bar_code !== barcode) setBarcode("");
  }, [productFetched]);

  return (
    <ContextScanner.Provider
      value={{
        setProductFetched,
        productFetched,
        activeScanner,
        setActiveScanner,
      }}
    >
      <BarcodeScanner onRead={setBarcode} />
      {productFetched && barcode && !activeScanner && (
        <>
          {productFetched.bar_code === barcode ? (
            <Popup onClose={handleClose}>
              <PopupConfirmProduct product={productFetched} />
            </Popup>
          ) : (
            <Popup onClose={handleClose}>
              <PopupIncorrectProduct />
            </Popup>
          )}
        </>
      )}
      {children}
    </ContextScanner.Provider>
  );
}

export function useScanner() {
  return useContext(ContextScanner);
}
