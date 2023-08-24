import { useAutoAnimate } from "@formkit/auto-animate/react";
import Loading from "app/loading";
import { useOrder } from "contexts/order";
import { useState } from "react";
import { ProductItem } from "./ProductItem";
import { BarcodeScanner } from "./Scanner";

export function ContentSection({
  status,
}: {
  status: "pending" | "revision" | "complete";
}) {
  const { orderData } = useOrder();
  const [parent] = useAutoAnimate();
  const [bar, setBar] = useState();

  return (
    <div ref={parent} className="mt-4">
      {orderData?.products ? (
        orderData.products[status].length > 0 ? (
          orderData.products[status].map((product) => {
            return <ProductItem key={product.id} {...product} />;
          })
        ) : (
          <>
            <BarcodeScanner />
            <div className="flex items-center justify-center ">
              Opa! Ainda não há nenhum produto aqui.
            </div>
          </>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}
