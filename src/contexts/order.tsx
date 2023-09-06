"use client";

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
import { useQuery } from "react-query";
import { apiBarapiV2 } from "services/api";
import { useScanner } from "./scanner";

export interface OrderProductProps {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  bar_code: string;
  price: string;
  regular_price: string;
  stock: number;
  quantity: number;
  image: {
    src: string;
    width: number;
    height: number;
    srcset: string;
    sizes: string;
    alt: string;
  };
  conference: {
    quantity: string;
    status: string;
  };
}

interface orderDataProps {
  customer: {
    name: string;
    phone: string;
  };
  products: OrderProductProps[];
}

interface OrderContextProps {
  productFetched: OrderProductProps;
  setProductFetched: (product: OrderProductProps) => void;
  setBarcode: (barcode: string) => void;
  orderData: {
    customer: {
      name: string;
      phone: string;
    };
    products: {
      pending: OrderProductProps[];
      revision: OrderProductProps[];
      complete: OrderProductProps[];
    };
  };
  quantityItems: {
    pending: number;
    revision: number;
    complete: number;
  };
  refetch: () => void;
}
const OrderContext = createContext<OrderContextProps>({} as OrderContextProps);

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderContextProvider({
  children,
  orderId,
}: {
  children: ReactNode;
  orderId: number;
}) {
  const [barcode, setBarcode] = useState("");
  const [productFetched, setProductFetched] =
    useState<OrderProductProps | null>(null);
  const { activeScanner } = useScanner();

  function handleClose() {
    setProductFetched(null);
  }

  useEffect(() => {
    if (productFetched && productFetched.bar_code !== barcode) setBarcode("");
  }, [productFetched]);

  const [quantityItems, setQuantityItems] = useState<
    OrderContextProps["quantityItems"]
  >({ pending: 0, revision: 0, complete: 0 });

  const {
    isError,
    data: orderData,
    refetch,
  } = useQuery(
    `get_order_products_${orderId}`,
    async () => {
      const { data } = await apiBarapiV2.get<orderDataProps>(
        `conference/${orderId}`
      );

      const newData = {
        ...data,
        products: {
          pending: [],
          revision: [],
          complete: [],
        },
      };

      data.products.forEach((product) => {
        switch (product.conference.status) {
          case "":
          case "pending":
            newData.products.pending.push(product);
            break;
          case "revision":
            newData.products.revision.push(product);
            break;
          case "complete":
            newData.products.complete.push(product);
            break;
        }
      });

      setQuantityItems({
        pending: newData.products.pending.length,
        revision: newData.products.revision.length,
        complete: newData.products.complete.length,
      });

      return newData;
    },

    { onError: (e) => console.log(e), refetchInterval: 3000 }
  );

  if (isError) {
    console.log("deu");
  }

  return (
    <OrderContext.Provider
      value={{
        orderData,
        quantityItems,
        refetch,
        productFetched,
        setProductFetched,
        setBarcode,
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
    </OrderContext.Provider>
  );
}
