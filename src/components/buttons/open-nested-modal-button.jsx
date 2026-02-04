"use client";

import { useModal } from "@/modal-stack/modal-context";

export function OpenNestedModalButton({ modalId }) {
  const { top, open } = useModal();
  const card = top.payload;

  const openModal = (modalId, card) => (event) => {
    open(modalId, event.currentTarget, card);
  };

  return (
    <button
      type="button"
      onClick={openModal(modalId, card)}
      className="rounded-xl bg-purple-400 text-white border border-black px-4 py-2 text-sm"
    >
      Open next nested modal
    </button>
  );
}
