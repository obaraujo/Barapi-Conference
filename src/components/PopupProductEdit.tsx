"use client";

import { propsProductEdit } from "app/atualiza-estoque/[business_slug]/page";
import { Input } from "barapi";
import { useForm } from "react-hook-form";
import { apiBarapiV2 } from "services/api";

export function PopupProductEdit({
  product,
  onSuccess,
}: {
  product: propsProductEdit;
  onSuccess: () => void;
}) {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data: { s: string }) {
    const form = new FormData();
    form.append("product_id", product.id.toString());
    form.append("bar_code", product.bar_code.toString());
    form.append("group", product.group.toString());

    Object.entries(data).forEach((d) => {
      form.append(d[0], d[1]);
    });

    await apiBarapiV2.post("conference/item", form);
    onSuccess();
  }

  return (
    product && (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            className="flex gap-1 items-center w-full bg-orange-barapi rounded-lg flex-1 text-white font-bold px-6 py-3 justify-center disabled:bg-gray-400"
            type="submit"
          >
            Salvar
          </button>
        </form>
      </>
    )
  );
}
