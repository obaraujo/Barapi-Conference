import * as Popover from "@radix-ui/react-popover";
import { propsProductEdit } from "app/atualiza-estoque/[business_slug]/page";
import { formatCurrencyBRL } from "barapi";
import { formatDate } from "functions";
import { useState } from "react";
import { FaCheckSquare, FaEdit, FaInfoCircle } from "react-icons/fa";
import { apiBarapiV2 } from "services/api";

export function CardProductListUpdate({
  product,
  onSuccess,
  businessSlug,
  setProductEdit,
}: {
  product: propsProductEdit;
  onSuccess: () => void;
  setProductEdit: (product: propsProductEdit) => void;
  businessSlug: string;
}) {
  const [disabled, setDisabled] = useState(false);

  async function onSubmit(productId: string, group: string) {
    setDisabled(true);
    const form = new FormData();
    form.append("product_id", productId.toString());
    form.append("group", group.toString());
    form.append("checked", "on");

    await apiBarapiV2
      .post(`/${businessSlug}/products_sync`, form)
      .catch(() => alert("Ocorreu um erro, chame do programador!"));

    onSuccess();
  }
  return (
    <div className="grid grid-cols-[1fr_3rem] mt-4 border-b border-black/40 pb-2" key={product.id}>
      <div className="flex flex-col">
        <h3 className="font-bold text-base text-black/80 line-clamp-1">{product.name}</h3>
        <div className="grid grid-cols-[1rem_1fr_3rem_4rem_3rem] justify-center gap-2">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className="rounded-full w-6 h-6 flex items-center justify-center"
                style={{
                  color: product?.updated ? "#00CE52" : "#ff4f00",
                }}
              >
                <FaInfoCircle />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity]"
                sideOffset={5}
              >
                {product?.date_update && (
                  <p className="font-semibold text-sm text-black/50">
                    Atualizado em: <strong className="font-bold">{formatDate(parseInt(product.date_update))}</strong>
                  </p>
                )}
                {product?.date_checked && (
                  <p className="font-semibold text-sm text-black/50">
                    Sincronizado em: <strong className="font-bold">{formatDate(parseInt(product.date_checked))}</strong>
                  </p>
                )}
                <Popover.Close />
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <p className="font-semibold text-sm text-black/50 flex-1 flex items-center justify-center">
            {product.bar_code}
          </p>
          <p className="font-semibold text-sm text-black/50  border-l-2 border-black/40 flex-1 flex items-center justify-center">
            {product.stock}
          </p>
          <p className="font-semibold text-sm text-black/50  border-l-2 border-black/40 flex-1 flex items-center justify-center">
            {formatCurrencyBRL(product.price)}
          </p>
          <p className="border-l-2 border-black/40 flex-1 flex items-center justify-center">
            {product.in_barapi_id ? "✅" : "❌"}
          </p>
        </div>
      </div>
      {product.updated && product?.checked !== "on" ? (
        <button
          onClick={() => onSubmit(product.id, product.group)}
          disabled={disabled}
          className="flex justify-center items-center text-white bg-green-barapi rounded-md disabled:bg-gray-400"
        >
          <FaCheckSquare />
        </button>
      ) : (
        <button
          onClick={() => setProductEdit(product)}
          className="flex justify-center items-center text-white bg-orange-barapi rounded-md"
        >
          <FaEdit />
        </button>
      )}
    </div>
  );
}
