"use client";

export function getFocusable(root) {
  if (!root) return [];
  const selectors = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const nodes = Array.from(root.querySelectorAll(selectors));
  return nodes.filter((el) => {
    const style = window.getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") return false;
    if (el.hasAttribute("disabled")) return false;
    return true;
  });
}

export function focusFirstIn(panel) {
  const focusables = getFocusable(panel);
  if (focusables.length > 0) focusables[0].focus();
  else panel.focus();
}

export function trapTabKey(panel, e) {
  const focusables = getFocusable(panel);
  if (focusables.length === 0) {
    e.preventDefault();
    panel.focus();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (e.shiftKey) {
    if (active === first || active === panel) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (active === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
