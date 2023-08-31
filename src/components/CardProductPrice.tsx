import { formatCurrencyBRL } from "barapi";

interface CardProductPriceProps {
  regular?: string;
  price: string;
}

export function CardProductPrice({ regular, price }: CardProductPriceProps) {
  const formatPrice = formatCurrencyBRL(price)
    .replace("R$", "")
    .trim()
    .split(",");

  return (
    <>
      {regular && regular !== price && (
        <div className="mt-2 text-base font-semibold ">
          <span className="mr-1  text-black/50 line-through">
            {formatCurrencyBRL(regular)}
          </span>
          <span className="whitespace-nowrap rounded-md bg-orange-barapi px-2  text-white">
            -{Math.round(100 - (parseFloat(price) / parseFloat(regular)) * 100)}
            %
          </span>
        </div>
      )}
      <div className=" mb-2 flex items-center text-base font-bold text-orange-barapi">
        <span>R$</span>
        <span className="text-3xl">{formatPrice[0]}</span>
        <span>,{formatPrice[1]}</span>
      </div>
    </>
  );
}
