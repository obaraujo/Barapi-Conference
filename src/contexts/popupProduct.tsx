"use client";

import { PopupProduct } from "@/components/PopupProduct";
import { ReactNode, createContext, useContext, useState } from "react";

interface PopupProductProps {
  productId: number;
  setProductId: (product: number) => void;
}

const ContextPopupProduct = createContext<PopupProductProps>(
  {} as PopupProductProps
);

export function PopupProductProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<number>(0);

  return (
    <ContextPopupProduct.Provider
      value={{
        setProductId,
        productId,
      }}
    >
      {!!productId && <PopupProduct productId={productId} />}

      {children}
    </ContextPopupProduct.Provider>
  );
}

export function usePopupProduct() {
  return useContext(ContextPopupProduct);
}
