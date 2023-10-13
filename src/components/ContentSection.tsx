import { useAutoAnimate } from "@formkit/auto-animate/react";
import Loading from "app/loading";
import { useOrder } from "contexts/order";
import { ProductItem } from "./ProductItem";

export function ContentSection({ status }: { status: "pending" | "revision" | "complete" }) {
  const { orderData } = useOrder();
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="mt-4 z-0">
      {orderData?.products ? (
        orderData.products[status].length > 0 ? (
          orderData.products[status].map((product) => {
            return <ProductItem key={product.id} {...product} />;
          })
        ) : (
          <>
            <div className="flex items-center justify-center ">Opa! Ainda não há nenhum produto aqui.</div>
          </>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}
