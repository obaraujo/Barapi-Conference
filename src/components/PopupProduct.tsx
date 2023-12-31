import { imageProps } from "@/types/images";
import { useOrder } from "contexts/order";
import { usePopupProduct } from "contexts/popupProduct";
import { useScanner } from "contexts/scanner";
import { getInfoQuantity } from "functions";
import { useState } from "react";
import { BiScan } from "react-icons/bi";
import { BsChatTextFill } from "react-icons/bs";
import { PiClockCountdownBold } from "react-icons/pi";
import { useQuery } from "react-query";
import { apiBarapiV2 } from "services/api";
import { CardProductPrice } from "./CardProductPrice";
import { Gallery } from "./Gallery";
import { Popup } from "./Popup";
import { PopupChat } from "./PopupChat";
import { SkeletonPopupProduct } from "./Skeleton";

interface ProductProps {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  bar_code: string;
  description: string;
  price: string;
  regular_price: string;
  stock: number;
  quantity: number;
  image: imageProps;
  gallery: imageProps[];
  conference: {
    quantity: string;
    status: "revision" | "complete";
  };
}

export function PopupProduct({ productId }: { productId: number }) {
  const { setProductId } = usePopupProduct();
  const [openChat, setOpenChat] = useState(false);
  const { setActiveScanner } = useScanner();
  const { setProductFetched } = useOrder();
  const { refetch } = useOrder();

  function handleClose() {
    setProductId(0);
  }

  const { isError, data: product } = useQuery(
    `get_order_data_product_${productId}`,
    async () => {
      const { data } = await apiBarapiV2.get<ProductProps>(`conference/item/${productId}`);
      return data;
    },

    { onError: (e) => console.log(e) },
  );

  async function handleVerification(state: "complete" | "revision") {
    setProductFetched(null);
    handleClose();
    const form = new FormData();
    form.append("order_item_id", product.id.toString());
    form.append("status", state);
    form.append("quantity", product.quantity.toString());
    await apiBarapiV2.post("conference/item", form);
    refetch();
  }

  return (
    <>
      <Popup onClose={handleClose} fullscreen>
        {!product ? (
          <SkeletonPopupProduct />
        ) : (
          <main className="pb-1">
            <Gallery images={[product.image, ...product.gallery]} />
            <span className="font-bold text-4xl text-orange-barapi">{product.quantity}x</span>
            <h3 className="font-semibold text-base capitalize">{product.name}</h3>
            <CardProductPrice price={product.price} regular={product.regular_price} />
            <div className="mt-4 text-gray-500">
              <div>
                <strong className="font-bold">Código de barras: </strong>
                <span className="font-semibold">{product.bar_code}</span>
              </div>
              <div>
                <strong className="font-bold">Conteúdo: </strong>
                <span className="font-semibold">{getInfoQuantity(product.name)}</span>
              </div>
              <div>
                <strong className="font-bold">Estoque: </strong>
                <span className="font-semibold">{product.stock}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-col">
              <div className="flex justify-between gap-2">
                {product.conference.status !== "revision" && (
                  <button
                    onClick={() => handleVerification("revision")}
                    className="flex  items-center justify-center gap-1 bg-white flex-1 border-orange-barapi border rounded-lg px-4 py-3 text-orange-barapi font-semibold"
                  >
                    <PiClockCountdownBold /> Em revisão
                  </button>
                )}
                <button
                  onClick={() => {
                    setOpenChat(true);
                    setProductFetched(product);
                  }}
                  className="flex gap-1 items-center border-orange-barapi border  rounded-lg flex-1 text-orange-barapi font-bold px-6 py-3 justify-center disabled:bg-gray-400"
                >
                  <BsChatTextFill /> Chat
                </button>
              </div>
              {product.conference.status !== "complete" && (
                <button
                  onClick={() => {
                    setProductFetched(product);
                    setActiveScanner(true);
                  }}
                  className="flex gap-1 items-center bg-orange-barapi rounded-lg flex-1 text-white font-bold px-6 py-3 justify-center disabled:bg-gray-400"
                >
                  <BiScan />
                  Escanear
                </button>
              )}
            </div>
          </main>
        )}
      </Popup>
      {openChat && (
        <Popup onClose={() => setOpenChat(false)}>
          <PopupChat onSendMessage={() => setOpenChat(false)} />
        </Popup>
      )}
    </>
  );
}
