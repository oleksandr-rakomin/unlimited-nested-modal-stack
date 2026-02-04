"use client";

import { MODALS } from "@/modal-stack/constants";

import { useModal } from "@/modal-stack/modal-context";

export function SomeCard({ card }) {
  const { title } = card;
  const { open } = useModal();

  const openModal = (modalId, card) => (event) => {
    open(modalId, event.currentTarget, card);
  };

  return (
    <div className="p-4 border rounded-xl flex flex-col items-center gap-4">
      <div className="font-semibold">{title}</div>

      <button
        type="button"
        className="rounded-xl bg-purple-400 text-white border border-black px-4 py-2 text-sm"
        onClick={openModal(MODALS.FIRST, card)}
      >
        Open FirstModal
      </button>
    </div>
  );
}
