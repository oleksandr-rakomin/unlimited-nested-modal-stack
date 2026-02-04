"use client";

import { useModal } from "@/modal-stack/modal-context";

import { CloseModalButton } from "@/components/buttons/close-modal-button";

export function ThirdModalComponent() {
  const { top } = useModal();
  const card = top.payload;

  return (
    <div className="flex flex-col items-start justify-between h-full">
      <p className="text-2xl font-bold">{card.fullDescription}</p>

      <CloseModalButton />
    </div>
  );
}
