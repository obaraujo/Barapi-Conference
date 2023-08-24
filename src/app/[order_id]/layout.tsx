"use client";

import { Navigation } from "@/components/Navigation";

import "@/styles/globals.css";
import { OrderContextProvider } from "contexts/order";
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
      <OrderContextProvider orderId={order_id}>
        <header>
          <Image src="/logo.svg" alt="" width={124} height={15} />
          <h1 className="font-bold text-lg mt-4">Compra #{order_id}</h1>
        </header>
        {children}
        <footer className="mt-20">
          <Navigation prefix={order_id.toString()} />
        </footer>
      </OrderContextProvider>
    </QueryClientProvider>
  );
}
