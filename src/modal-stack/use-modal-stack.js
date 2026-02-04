"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { focusFirstIn } from "./focus-helpers";

/**
 * Nested modals stack logic.
 */
export function useModalStack() {
  // stack items: { modalId: "first"|"second"|"third", instanceKey: string, openerEl: HTMLElement|null }
  const [stack, setStack] = useState([]);
  const stackRef = useRef(stack);
  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);

  const instanceSeqRef = useRef(0);
  const scrollLockRef = useRef({
    locked: false,
    scrollY: 0,
    bodyStyle: null,
  });

  // Keep panel refs per modal instance (for focusing/trap)
  const panelRefs = useRef(new Map()); // instanceKey -> HTMLElement

  const top = stack[stack.length - 1] || null;
  const topIndex = stack.length - 1;

  const lockScroll = useCallback(() => {
    if (scrollLockRef.current.locked) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const body = document.body;

    scrollLockRef.current.locked = true;
    scrollLockRef.current.scrollY = scrollY;
    scrollLockRef.current.bodyStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    // iOS-friendly lock
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    if (!scrollLockRef.current.locked) return;

    const body = document.body;
    const prev = scrollLockRef.current.bodyStyle;
    const scrollY = scrollLockRef.current.scrollY;

    if (prev) {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
    } else {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
    }

    scrollLockRef.current.locked = false;
    scrollLockRef.current.scrollY = 0;
    scrollLockRef.current.bodyStyle = null;

    // restore scroll without jump
    window.scrollTo(0, scrollY);
  }, []);

  const createInstanceKey = useCallback((modalId) => {
    instanceSeqRef.current += 1;
    return `${modalId}-${Date.now()}-${instanceSeqRef.current}`;
  }, []);

  const pushHistory = useCallback((modalId, instanceKey) => {
    // one history entry per open; back/gesture will pop & we close in popstate
    history.pushState({ __modal: true, modalId, instanceKey }, "");
  }, []);

  const open = useCallback(
    (modalId, openerEl, payload) => {
      const instanceKey = createInstanceKey(modalId);

      setStack((prev) => [
        ...prev,
        {
          modalId,
          instanceKey,
          openerEl: openerEl || null,
          payload: payload ?? null,
        },
      ]);

      // lock scroll on first open
      if (stackRef.current.length === 0) lockScroll();

      pushHistory(modalId, instanceKey);
    },
    [createInstanceKey, lockScroll, pushHistory],
  );

  // Close by UI/backdrop button: we trigger history.back(), and popstate will update UI.
  const requestCloseTopViaHistory = useCallback(() => {
    if (stackRef.current.length === 0) return;
    history.back();
  }, []);

  // Actually close top (used by popstate)
  const closeTopInternal = useCallback(() => {
    const current = stackRef.current;
    if (current.length === 0) return;

    const closing = current[current.length - 1];

    setStack((prev) => prev.slice(0, -1));

    // Restore focus:
    // - if there will still be a modal open, focus its panel
    // - otherwise focus the opener that launched the closing modal
    const nextStack = current.slice(0, -1);
    queueMicrotask(() => {
      if (nextStack.length > 0) {
        const nextTop = nextStack[nextStack.length - 1];
        const panel = panelRefs.current.get(nextTop.instanceKey);
        if (panel) focusFirstIn(panel);
      } else {
        const opener = closing?.openerEl;
        if (opener && typeof opener.focus === "function") opener.focus();
      }
    });

    // unlock scroll on last close
    if (current.length === 1) {
      queueMicrotask(() => unlockScroll());
    }
  }, [unlockScroll]);

  // popstate: close one modal per "back"
  useEffect(() => {
    const onPopState = () => {
      if (stackRef.current.length > 0) {
        closeTopInternal();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [closeTopInternal]);

  // Focus management: when a new modal becomes top, focus inside it
  useEffect(() => {
    if (!top) return;

    const t = setTimeout(() => {
      const panel = panelRefs.current.get(top.instanceKey);
      if (panel) focusFirstIn(panel);
    }, 0);

    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [top?.instanceKey]);

  // Helper: register panel node
  const registerPanelRef = useCallback((instanceKey) => {
    return (node) => {
      if (!instanceKey) return;
      if (node) panelRefs.current.set(instanceKey, node);
      else panelRefs.current.delete(instanceKey);
    };
  }, []);

  return {
    stack,
    top,
    topIndex,
    open,
    requestCloseTopViaHistory,
    registerPanelRef,
  };
}
