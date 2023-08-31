"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { apiBarapiV2 } from "services/api";

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
    <OrderContext.Provider value={{ orderData, quantityItems, refetch }}>
      {children}
    </OrderContext.Provider>
  );
}
