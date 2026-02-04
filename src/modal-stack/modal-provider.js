"use client";

import { ModalContext } from "./modal-context";
import { useModalStack } from "./use-modal-stack";

export function ModalProvider({ children }) {
  const modal = useModalStack();

  return (
    <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
  );
}
