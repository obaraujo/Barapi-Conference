import { useScanner } from "contexts/scanner";

export function PopupIncorrectProduct({}: {}) {
  const { setActiveScanner } = useScanner();

  return (
    <>
      <header>
        <h3 className="font-bold text-base">Produto incorreto :(</h3>
      </header>
      <main>
        <button
          onClick={() => setActiveScanner(true)}
          className="mt-5 w-full flex  items-center justify-center gap-1 bg-orange-barapi text-white font-semibold rounded-lg px-4 py-3"
        >
          Tentar novamente
        </button>
      </main>
    </>
  );
}
