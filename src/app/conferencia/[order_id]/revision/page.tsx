"use client";

import { ContentSection } from "@/components/ContentSection";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Revisão - Conferencia de compra",
};

export default function Page() {
  return <ContentSection status={"revision"} />;
}
