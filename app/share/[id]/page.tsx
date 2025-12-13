// app/share/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { getPublicShare } from "@/lib/publicShareStore";
import SharePageClient from "@/components/SharePageClient";

type Props = {
  params: { id: string };
};

export default async function SharePage({ params }: Props) {
  const { id } = params;

  const record = await getPublicShare(id);

  if (!record) {
    return notFound();
  }

  return <SharePageClient record={record} />;
}
