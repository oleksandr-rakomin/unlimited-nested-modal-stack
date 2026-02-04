"use client";

import { useModal } from "@/modal-stack/modal-context";

export function CloseModalButton() {
  const { requestCloseTopViaHistory } = useModal();

  const closeModal = () => {
    requestCloseTopViaHistory();
  };

  return (
    <button
      type="button"
      onClick={closeModal}
      className="rounded-xl bg-green-400 text-white border border-black px-4 py-2 text-sm"
    >
      Close
    </button>
  );
}
