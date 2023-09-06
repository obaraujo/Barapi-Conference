"use client";

import { Popup } from "@/components/Popup";
import { PopupProductEdit } from "@/components/PopupProductEdit";
import { BarcodeScanner } from "@/components/Scanner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { formatCurrencyBRL } from "barapi";
import { useScanner } from "contexts/scanner";
import { useEffect, useState, useTransition } from "react";
import { BiScan } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
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
  group?: string;
}

export type propsProductsResponse = { [key: string]: propsProductEdit[] };

export default function Page({
  params: { business_slug },
}: {
  params: { business_slug: string };
}) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<propsProductEdit[]>(null);
  const [productEdit, setProductEdit] = useState<propsProductEdit>(null);
  const { setActiveScanner } = useScanner();
  const [isPending, setTransition] = useTransition();
  const [parentAnimation] = useAutoAnimate();

  const { isError, data, refetch } = useQuery(
    `get_order_products_${business_slug}`,
    async () => {
      const { data } = await apiBarapiV2
        .get<propsProductsResponse>(`/${business_slug}/products_sync`)
        .catch();

      return {
        ...data,
        products: Object.keys(data.products)
          .map((group) =>
            data.products[group].map((product) => {
              return { ...product, group };
            })
          )
          .flatMap((productsSync) => productsSync),
      };
    },

    {
      onError: (e) => console.log(e),
    }
  );

  useEffect(() => {
    if (data?.products) {
      setTransition(() => {
        setProducts(
          data.products
            .filter(
              (product) =>
                product.name.toLowerCase().includes(search) ||
                product.bar_code.includes(search)
            )
            .slice(0, 20)
        );
      });
    }
  }, [search, data]);

  return (
    <div className="mt-4">
      <BarcodeScanner onRead={setSearch} />
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
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
      </div>
      {isPending && "Carregando"}
      <div className="mt-4" ref={parentAnimation}>
        {products &&
          products.map((product) => {
            return (
              <div
                className="grid grid-cols-[1fr_4rem] mt-4 border-b border-black/40 pb-2"
                key={product.id}
              >
                <div className="flex flex-col">
                  <h3 className="font-bold text-base text-black/80 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="grid grid-cols-[7rem_4rem_5rem_3rem] justify-center gap-2">
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
                <button
                  onClick={() => setProductEdit(product)}
                  className="flex justify-center items-center text-white bg-orange-barapi rounded-md"
                >
                  <FaEdit />
                </button>
              </div>
            );
          })}
      </div>
      {productEdit && (
        <Popup onClose={() => setProductEdit(null)}>
          <PopupProductEdit
            product={productEdit}
            onSuccess={() => setProductEdit(null)}
          />
        </Popup>
      )}
    </div>
  );
}
