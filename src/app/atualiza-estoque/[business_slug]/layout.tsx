"use client";

import "@/styles/globals.css";
import { PopupProductProvider } from "contexts/popupProduct";
import { ScannerProvider } from "contexts/scanner";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function ConferenceLayout({
  children,
  params: { order_id },
}: {
  children: React.ReactNode;
  params: { order_id: number };
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <header>
        <Image src="/logo.svg" alt="" width={124} height={15} />
        <h1 className="font-bold text-lg mt-4">Atualização de estoque</h1>
      </header>
      <ScannerProvider>
        <PopupProductProvider>{children}</PopupProductProvider>
      </ScannerProvider>
    </QueryClientProvider>
  );
}
