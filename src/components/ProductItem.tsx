import { Image } from "@/components/Image";
import { getInfoQuantity } from "functions";
import { BiScan } from "react-icons/bi";

interface ProductItemProps {
  id: number;
  image: {
    src: string;
    alt: string;
  };
  quantity: number;
  name: string;
}

export function ProductItem({ id, image, quantity, name }: ProductItemProps) {
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
              {getInfoQuantity(name)}
            </span>
          </div>
          <button className="flex gap-1 items-center bg-orange-barapi rounded-lg text-white font-bold px-6 h-11">
            <BiScan /> Escanear
          </button>
        </div>
      </div>
    </div>
  );
}
