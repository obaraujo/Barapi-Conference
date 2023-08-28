import { Image } from "@/components/Image";
import { formatCurrencyBRL } from "barapi";
import { OrderProductProps, useOrder } from "contexts/order";
import { useScanner } from "contexts/scanner";
import { useEffect, useState } from "react";
import { BsFillCheckSquareFill } from "react-icons/bs";
import { ImClock } from "react-icons/im";
import { apiBarapiV2 } from "services/api";

export function ProductItem({
  id,
  image,
  quantity,
  name,
  bar_code,
  price,
  conference: { status },
}: OrderProductProps) {
  const { refetch } = useOrder();
  const [disabled, setDisabled] = useState(false);
  const { setActiveScanner, barcode } = useScanner();
  console.log(barcode);

  useEffect(() => {
    console.log("original: " + bar_code);
    console.log("lido: " + barcode);

    if (bar_code === barcode) {
      handleCheck();
    }
  }, [barcode]);

  async function handleCheck() {
    setDisabled(true);
    const form = new FormData();
    form.append("order_item_id", id.toString());
    form.append("status", "complete");
    form.append("quantity", quantity.toString());
    await apiBarapiV2.post("conference/item", form);
    refetch();
  }
  async function handleRevision() {
    setDisabled(true);

    const form = new FormData();
    form.append("order_item_id", id.toString());
    form.append("status", "revision");
    form.append("quantity", quantity.toString());

    await apiBarapiV2.post("conference/item", form);
    refetch();
  }
  return (
    <div
      className=" py-4 grid gap-3 grid-cols-[100px_1fr] border-[#E5E7EB] border-b"
      key={id}
    >
      <Image
        className="aspect-square bg-[#F9F9F9] rounded-md"
        src={image.src}
        alt={image.alt}
      />
      <div className="flex flex-col justify-between">
        <h2 className="font-semibold text-base">{name}</h2>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-bold text-4xl text-orange-barapi">
              {quantity}x
            </span>
            <span className="font-semibold text-sm text-black/30">
              {formatCurrencyBRL(price)}
            </span>
          </div>
          {status !== "complete" && (
            <div className="flex gap-1">
              {status !== "revision" && (
                <button
                  disabled={disabled}
                  onClick={handleRevision}
                  className="flex gap-1 items-center bg-yellow-barapi rounded-lg text-white font-bold px-6 h-11 disabled:bg-gray-400"
                >
                  {/* <BiScan /> */}
                  <ImClock />
                </button>
              )}
              <button
                disabled={disabled}
                onClick={() => setActiveScanner(true)}
                className="flex gap-1 items-center bg-green-barapi rounded-lg text-white font-bold px-6 h-11 disabled:bg-gray-400"
              >
                {/* <BiScan />  */}
                <BsFillCheckSquareFill />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
