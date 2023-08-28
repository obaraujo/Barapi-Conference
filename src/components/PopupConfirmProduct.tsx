import { OrderProductProps, useOrder } from "contexts/order";
import { useScanner } from "contexts/scanner";
import { useEffect, useState } from "react";
import { BsChatTextFill } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { ImCheckmark } from "react-icons/im";
import { PiClockCountdownBold } from "react-icons/pi";
import { apiBarapiV2 } from "services/api";
import { ProductItem } from "./ProductItem";

export function PopupConfirmProduct({
  product,
}: {
  product: OrderProductProps;
}) {
  const [quantity, setQuantity] = useState(0);
  const { setProductFetched } = useScanner();

  const { refetch } = useOrder();

  async function handleVerification(state: "complete" | "revision") {
    const form = new FormData();
    form.append("order_item_id", product.id.toString());
    form.append("status", state);
    form.append("quantity", quantity.toString());
    await apiBarapiV2.post("conference/item", form);
    refetch();
  }

  useEffect(() => {
    if (product) {
      setQuantity(product.quantity);
    }
  }, [product]);

  return (
    <div
      data-active={!!product}
      className="data-[active=false]:invisible fixed left-0 bottom-0 right-0 top-0 z-30 flex flex-col items-end bg-black/20"
    >
      <div
        className="w-full h-full"
        onClick={() => setProductFetched(null)}
      ></div>

      <div
        data-active={!!product}
        className="animate-showpopup data-[active=false]:animate-hidepopup p-4  bg-white rounded-tr-2xl rounded-tl-2xl border-t border-orange-barapi"
      >
        {product && (
          <>
            <header>
              <h3 className="font-bold text-base">Confirmando...</h3>
            </header>
            <main>
              <ProductItem {...product} scan={false} />
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-3 mt-3"
              >
                <fieldset className="flex justify-between">
                  <button
                    onClick={() =>
                      setQuantity((oldQuantity) => oldQuantity - 1)
                    }
                    disabled={quantity === 0}
                    className="disabled:bg-gray-400 rounded-full w-10 h-10 bg-orange-barapi flex text-white justify-center items-center"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(() => {
                        const newQuantity = parseInt(e.currentTarget.value);
                        return newQuantity;
                      })
                    }
                    className="text-center font-semibold text-lg outline-none border-none"
                  />
                  <button
                    onClick={() =>
                      setQuantity((oldQuantity) => oldQuantity + 1)
                    }
                    disabled={quantity === product.quantity}
                    className="disabled:bg-gray-400 rounded-full w-10 h-10 bg-orange-barapi flex text-white justify-center items-center"
                  >
                    <FaPlus />
                  </button>
                </fieldset>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => handleVerification("revision")}
                    className="flex  items-center justify-center gap-1 bg-white flex-1 border-orange-barapi border rounded-lg px-4 py-3 text-orange-barapi font-semibold"
                  >
                    <PiClockCountdownBold /> Em revisão
                  </button>
                  <button className="flex  items-center justify-center gap-1 bg-white flex-1 border-orange-barapi border rounded-lg px-4 py-3 text-orange-barapi font-semibold">
                    <BsChatTextFill /> Chat
                  </button>
                </div>
                <button
                  onClick={() => handleVerification("complete")}
                  className="flex-1 flex  items-center justify-center gap-1 bg-orange-barapi text-white font-semibold rounded-lg px-4 py-3"
                >
                  <ImCheckmark />
                  Confirmar
                </button>
              </form>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
