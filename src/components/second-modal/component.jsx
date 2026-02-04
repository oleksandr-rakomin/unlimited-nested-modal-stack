"use client";

import { useModal } from "@/modal-stack/modal-context";

import { MODALS } from "@/modal-stack/constants";

import { OpenNestedModalButton } from "@/components/buttons/open-nested-modal-button";
import { CloseModalButton } from "@/components/buttons/close-modal-button";

export function SecondModalComponent() {
  const { top } = useModal();
  const card = top.payload;

  return (
    <div className="flex flex-col items-start justify-between h-full">
      <p className="text-2xl font-bold">{card.shortDescription}</p>

      <OpenNestedModalButton modalId={MODALS.THIRD} />

      <CloseModalButton />
    </div>
  );
}
