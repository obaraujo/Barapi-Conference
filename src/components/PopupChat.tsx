import { useOrder } from "contexts/order";
import { useScanner } from "contexts/scanner";
import { BsChatTextFill } from "react-icons/bs";
import { TbSend } from "react-icons/tb";

export function PopupChat({
  quantityReal,
  onSendMessage,
}: {
  quantityReal: number;
  onSendMessage: () => void;
}) {
  const { productFetched } = useScanner();
  const {
    orderData: { customer },
  } = useOrder();

  function handleSendMessage(
    type?: "outOfStokeWithOthers" | "outOfStokeWithoutOthers" | "lowerQuantity"
  ) {
    let message = "";
    if (type) {
      const messages = {
        outOfStokeWithOthers: `O produto "{productName}" está em falta, temos a seguinte opções: `,
        outOfStokeWithoutOthers: `O produto "{productName}" está em falta. Infelizmente não temos outras opções.`,
        lowerQuantity: `Você pediu {quantity} "{productName}", porém infelizmente só temos {quantityReal}.`,
      };
      message = encodeURIComponent(
        messages[type]
          .replace("{productName}", productFetched.name)
          .replace("{customerName}", customer.name)
          .replace("{quantity}", productFetched.quantity.toString())
          .replace("{quantityReal}", quantityReal.toString())
      );
    }

    const phoneNumber = `55${customer.phone.replace(/\D/g, "")}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let url: string;
    url = `https://${
      isMobile ? "api" : "web"
    }.whatsapp.com/send/?phone=${phoneNumber}`;
    if (message) {
      url += `&text=${message}`;
    }
    window.open(url, "blank");
    onSendMessage();
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleSendMessage("outOfStokeWithOthers")}
        className="flex items-center justify-center gap-1 border-orange-barapi border text-orange-barapi font-semibold rounded-lg px-4 py-3"
      >
        Fora de estoque com outras opções
        <TbSend size={20} />
      </button>
      <button
        onClick={() => handleSendMessage("outOfStokeWithoutOthers")}
        className="flex items-center justify-center gap-1 border-orange-barapi border text-orange-barapi font-semibold rounded-lg px-4 py-3"
      >
        Fora de estoque sem outras opções
        <TbSend size={20} />
      </button>
      <button
        onClick={() => handleSendMessage("lowerQuantity")}
        className="flex items-center justify-center gap-1 border-orange-barapi border text-orange-barapi font-semibold rounded-lg px-4 py-3"
      >
        Quantidade inferior
        <TbSend size={20} />
      </button>
      <button
        onClick={() => handleSendMessage()}
        className="flex items-center justify-center gap-1 bg-orange-barapi border border-orange-barapi text-white font-semibold rounded-lg px-4 py-3"
      >
        <BsChatTextFill size={20} />
        Abrir chat
      </button>
    </div>
  );
}
