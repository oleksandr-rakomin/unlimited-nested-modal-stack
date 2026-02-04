"use client";

import { MODALS } from "@/modal-stack/constants";

import { useModal } from "@/modal-stack/modal-context";
import { trapTabKey } from "@/modal-stack/focus-helpers";

export function SecondModalShell({ children }) {
  const { stack, top, topIndex, requestCloseTopViaHistory, registerPanelRef } =
    useModal();

  if (!top || top.modalId !== MODALS.SECOND) return null;

  const isTop = stack.length - 1 === topIndex;
  const instanceKey = top.instanceKey;

  const handleBackdropClickCloseActiveModal = () => {
    if (!isTop) return;
    requestCloseTopViaHistory();
  };

  const preventBackdropCloseFromPanelClick = (e) => {
    e.stopPropagation();
  };

  const handleActiveModalKeyboardInteraction = (e) => {
    if (!isTop) return;

    if (e.key === "Escape") {
      e.preventDefault();
      requestCloseTopViaHistory();
      return;
    }

    if (e.key === "Tab") {
      trapTabKey(e.currentTarget, e);
    }
  };

  return (
    <div
      data-modal={MODALS.SECOND}
      data-modal-instance={instanceKey}
      className="fixed inset-0 flex items-center justify-center z-[100]"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onMouseDown={handleBackdropClickCloseActiveModal}
      />

      {/* Panel */}
      <div
        ref={registerPanelRef(instanceKey)}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Modal"
        className="fixed w-[60vw] h-[60vh] rounded-xl p-10 bg-orange-200"
        onMouseDown={preventBackdropCloseFromPanelClick}
        onKeyDown={handleActiveModalKeyboardInteraction}
      >
        {children}
      </div>
    </div>
  );
}
