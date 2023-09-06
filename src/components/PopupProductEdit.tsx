"use client";

import { propsProductEdit } from "app/atualiza-estoque/[business_slug]/page";
import { Input } from "barapi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiBarapiV2 } from "services/api";

export function PopupProductEdit({
  product,
  onSuccess,
  businessSlug,
}: {
  product: propsProductEdit;
  onSuccess: () => void;
  businessSlug: string;
}) {
  const { register, handleSubmit } = useForm();
  const [disabled, setDisabled] = useState(false);

  async function onSubmit(data: { s: string }) {
    setDisabled(true);
    const form = new FormData();
    form.append("product_id", product.id.toString());
    form.append("bar_code", product.bar_code.toString());
    form.append("group", product.group.toString());
    form.append("date_update", Date.now().toString());

    Object.entries(data).forEach((d) => {
      form.append(d[0], d[1]);
    });

    await apiBarapiV2
      .post(`/${businessSlug}/products_sync`, form)
      .catch(() => alert("Ocorreu um erro, chame do programador!"));

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        register={register}
        value={product.name.toString()}
        name="name"
        type="text"
      />
      <Input
        label="Estoque"
        register={register}
        value={product.stock.toString()}
        name="stock"
        type="number"
      />
      <Input
        label="Preço"
        register={register}
        value={product.price.toString()}
        name="price"
        type="number"
      />
      <button
        disabled={disabled}
        className="flex gap-1 items-center w-full bg-orange-barapi rounded-lg flex-1 text-white font-bold px-6 py-3 justify-center disabled:bg-gray-400"
        type="submit"
      >
        Salvar
      </button>
    </form>
  );
}
