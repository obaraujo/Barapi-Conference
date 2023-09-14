"use client";

import { Popup } from "@/components/Popup";
import { PopupProductEdit } from "@/components/PopupProductEdit";
import { BarcodeScanner } from "@/components/Scanner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as Popover from "@radix-ui/react-popover";
import { formatCurrencyBRL } from "barapi";
import "barapi/dist/tailwind.css";
import { useScanner } from "contexts/scanner";
import { formatDate } from "functions";
import { Metadata } from "next";
import { useEffect, useState, useTransition } from "react";
import { BiScan } from "react-icons/bi";
import { FaCheckSquare, FaEdit, FaInfoCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { apiBarapiV2 } from "services/api";

export interface propsProductEdit {
  id: string;
  sku: string;
  bar_code: string;
  name: string;
  price: string;
  stock: number;
  commercial_unit: "UN" | "KG";
  in_barapi_id: number | null;
  group: string;
  date_update: string;
  updated: boolean;
  checked?: "on" | "off";
}

export type propsProductsResponse = { [key: string]: propsProductEdit[] };

const metadata: Metadata = {
  title: "Atualização de estoque",
};

export default function Page({ params: { business_slug } }: { params: { business_slug: string } }) {
  const [search, setSearch] = useState("");
  const [filterUpdated, setFilterUpdated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [products, setProducts] = useState<propsProductEdit[]>(null);
  const [productEdit, setProductEdit] = useState<propsProductEdit>(null);
  const { setActiveScanner } = useScanner();
  const [isPending, setTransition] = useTransition();
  const [parentAnimation] = useAutoAnimate();

  const { isError, data, refetch } = useQuery(
    `get_order_products_${business_slug}`,
    async () => {
      const { data } = await apiBarapiV2.get<propsProductsResponse>(`/${business_slug}/products_sync`).catch();

      return {
        ...data,
        products: Object.keys(data.products)
          .map((group) =>
            data.products[group].map((product) => {
              return { ...product, group };
            }),
          )
          .flatMap((productsSync) => productsSync),
      };
    },

    {
      onError: (e) => console.log(e),
    },
  );

  useEffect(() => {
    if (data?.products) {
      setTransition(() => {
        setProducts(
          data.products
            .filter((product) => {
              let filter = product.name.toLowerCase().includes(search) || product.bar_code.includes(search);
              filter = filter && (!!product.updated === filterUpdated || product.checked === "on");
              filter = filter && !(filterUpdated && product.checked === "on");

              return filter;
            })
            .slice(0, 20),
        );
      });
    }
  }, [search, filterUpdated, data]);

  async function onSubmit(productId: string, group: string) {
    setDisabled(true);
    const form = new FormData();
    form.append("product_id", productId.toString());
    form.append("group", group.toString());
    form.append("checked", "on");

    await apiBarapiV2
      .post(`/${business_slug}/products_sync`, form)
      .catch(() => alert("Ocorreu um erro, chame do programador!"));

    refetch();
    setDisabled(false);
  }

  return (
    <div className="mt-4">
      <BarcodeScanner onRead={setSearch} />
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value.toLowerCase())}
          onDoubleClick={() => setSearch("")}
          placeholder="Procure por nome ou código de barras"
          className="rounded-xl border border-orange-barapi py-2 px-3 text-base w-full h-14"
        />

        <button
          onClick={() => {
            setActiveScanner(true);
          }}
          className="flex gap-1 items-center w-full bg-orange-barapi rounded-lg flex-1 text-white font-bold px-6 py-3 justify-center disabled:bg-gray-400"
        >
          <BiScan />
          Escanear
        </button>
        <p className="flex gap-2 font-bold text-base text-black/80">
          <input type="checkbox" id="filter_updated" onClick={(e) => setFilterUpdated(e.currentTarget.checked)} />
          <label htmlFor="filter_updated">Atualizados</label>
        </p>
      </div>
      <div className="mt-4" ref={parentAnimation}>
        {products &&
          products.map((product) => {
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
                              Atualizado em:{" "}
                              <strong className="font-bold">{formatDate(parseInt(product.date_update))}</strong>
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
          })}
      </div>
      {productEdit && (
        <Popup onClose={() => setProductEdit(null)}>
          <PopupProductEdit
            product={productEdit}
            businessSlug={business_slug}
            onSuccess={() => {
              refetch();
              setProductEdit(null);
            }}
          />
        </Popup>
      )}
    </div>
  );
}
