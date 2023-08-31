import { Image } from "@/components/Image";
import { formatCurrencyBRL } from "barapi";
import { OrderProductProps } from "contexts/order";
import { usePopupProduct } from "contexts/popupProduct";
import { useScanner } from "contexts/scanner";
import { BiScan } from "react-icons/bi";

export function ProductItem(props: OrderProductProps & { scan?: boolean }) {
  const { id, image, quantity, name, price, scan = true, conference } = props;
  const { setProductFetched, setActiveScanner } = useScanner();
  const { setProductId } = usePopupProduct();
  return (
    <div
      className=" py-4 grid gap-3 grid-cols-[100px_1fr] border-[#E5E7EB] border-b"
      key={id}
    >
      <div onClick={() => setProductId(id)}>
        <Image
          className="aspect-square bg-[#F9F9F9] rounded-md"
          src={image.src}
          alt={image.alt}
        />
      </div>
      <div className="flex flex-col justify-between">
        <h2 className="font-semibold text-base">{name}</h2>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            {conference?.quantity &&
            parseFloat(conference.quantity) !== quantity ? (
              <div className="flex gap-2 items-center">
                <span className="font-bold text-4xl text-orange-barapi">
                  {conference.quantity}x
                </span>
                <span className="font-bold text-xl text-orange-barapi/50  line-through">
                  {quantity}x
                </span>
              </div>
            ) : (
              <span className="font-bold text-4xl text-orange-barapi">
                {quantity}x
              </span>
            )}

            <span className="font-semibold text-base text-black/50">
              {formatCurrencyBRL(price)}
            </span>
          </div>
          {conference.status !== "complete" && scan && (
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setProductFetched(props);
                  setActiveScanner(true);
                }}
                className="flex gap-1 items-center bg-orange-barapi rounded-lg text-white font-bold px-6 h-11 disabled:bg-gray-400"
              >
                <BiScan />
                Escanear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
