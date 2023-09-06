import { useOrder } from "contexts/order";
import { useScanner } from "contexts/scanner";
import { GiPush } from "react-icons/gi";
import { TbReload } from "react-icons/tb";

export function PopupIncorrectProduct({}: {}) {
  const { setActiveScanner } = useScanner();
  const { productFetched, setBarcode } = useOrder();

  return (
    <>
      <header>
        <h3 className="font-bold text-base">Produto incorreto :(</h3>
      </header>
      <main className="flex flex-col gap-2 ">
        <button
          onClick={() => setActiveScanner(true)}
          className="mt-5 flex  items-center justify-center gap-1 bg-orange-barapi text-white font-semibold rounded-lg px-4 py-3"
        >
          <TbReload size={20} />
          Tentar novamente
        </button>
        <button
          onClick={() => {
            if (productFetched?.bar_code) {
              setBarcode(productFetched.bar_code);
            } else {
              alert("Sem produto para confirmar, tente novamente!");
            }
          }}
          className="flex items-center justify-center gap-1 border-orange-barapi border text-orange-barapi font-semibold rounded-lg px-4 py-3"
        >
          <GiPush size={20} />
          Forçar confirmação
        </button>
      </main>
    </>
  );
}
