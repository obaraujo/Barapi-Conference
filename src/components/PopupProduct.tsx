import { imageProps } from "@/types/images";
import { usePopupProduct } from "contexts/popupProduct";
import { getInfoQuantity } from "functions";
import { useQuery } from "react-query";
import { apiBarapiV2 } from "services/api";
import { CardProductPrice } from "./CardProductPrice";
import { Gallery } from "./Gallery";
import { Popup } from "./Popup";
import { SkeletonPopupProduct } from "./Skeleton";

interface ProductProps {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  bar_code: string;
  description: string;
  price: string;
  regular_price: string;
  stock: number;
  quantity: number;
  image: imageProps;
  gallery: imageProps[];
  conference: {
    quantity: string;
    status: "revision";
  };
}

export function PopupProduct({ productId }: { productId: number }) {
  const { setProductId } = usePopupProduct();

  function handleClose() {
    setProductId(0);
  }
  const {
    isError,
    data: product,
    refetch,
  } = useQuery(
    `get_order_data_product_${productId}`,
    async () => {
      const { data } = await apiBarapiV2.get<ProductProps>(
        `conference/item/${productId}`
      );
      return data;
    },

    { onError: (e) => console.log(e) }
  );

  return (
    <Popup onClose={handleClose}>
      {!product ? (
        <SkeletonPopupProduct />
      ) : (
        <main className="scrollbar-hidden md:scrollbar-show max-h-[100%] overflow-y-auto pb-1">
          <Gallery images={[product.image, ...product.gallery]} />
          <span className="font-bold text-4xl text-orange-barapi">
            {product.quantity}x
          </span>
          <h3 className="font-semibold text-base capitalize">{product.name}</h3>
          <CardProductPrice
            price={product.price}
            regular={product.regular_price}
          />

          <div className="mt-4 text-gray-500">
            <div>
              <strong className="font-bold">Código de barras: </strong>
              <span className="font-semibold">{product.bar_code}</span>
            </div>
            <div>
              <strong className="font-bold">Conteúdo: </strong>
              <span className="font-semibold">
                {getInfoQuantity(product.name)}
              </span>
            </div>
            <div>
              <strong className="font-bold">Estoque: </strong>
              <span className="font-semibold">{product.stock}</span>
            </div>
          </div>
        </main>
      )}
    </Popup>
  );
}
