"use client";

import { CardProductListUpdate } from "@/components/CardProductListUpdate";
import { Popup } from "@/components/Popup";
import { PopupProductEdit } from "@/components/PopupProductEdit";
import { BarcodeScanner } from "@/components/Scanner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "barapi/dist/tailwind.css";
import { useScanner } from "contexts/scanner";
import { Metadata } from "next";
import { useEffect, useState, useTransition } from "react";
import { BiScan } from "react-icons/bi";
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
  date_checked?: string;
  checked?: "on" | "off";
}

export type propsProductsResponse = { [key: string]: propsProductEdit[] };

const metadata: Metadata = {
  title: "Atualização de estoque",
};

export default function Page({ params: { business_slug } }: { params: { business_slug: string } }) {
  const [search, setSearch] = useState("");
  const [filterUpdated, setFilterUpdated] = useState(false);
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
          data.products.filter((product) => {
            let filter = product.name.toLowerCase().includes(search) || product.bar_code.includes(search);
            filter = filter && (!!product.updated === filterUpdated || product.checked === "on");
            filter = filter && !(filterUpdated && product.checked === "on");

            return filter;
          }),
        );
      });
    }
  }, [search, filterUpdated, data]);

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
        {products && <div>{products.length} produtos</div>}

        <p className="flex gap-2 font-bold text-base text-black/80">
          <input type="checkbox" id="filter_updated" onClick={(e) => setFilterUpdated(e.currentTarget.checked)} />
          <label htmlFor="filter_updated">Atualizados</label>
        </p>
      </div>
      <div className="mt-4" ref={parentAnimation}>
        {products &&
          products.slice(0, 20).map((product) => {
            return (
              <CardProductListUpdate
                key={`${product.in_barapi_id}-${product.id}-${product.bar_code}`}
                product={product}
                onSuccess={() => {
                  refetch();
                }}
                setProductEdit={setProductEdit}
                businessSlug={business_slug}
              />
            );
          })}

        {products && products.length < 1 && <div className="flex items-center justify-center">Opa, sem produtos!</div>}
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
