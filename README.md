# unlimited-nested-modal-stack

A flexible and scalable **nested modal system** for Next.js / React applications.

This module provides a stable modal foundation with support for:

- Nested modals (stack)
- Browser **Back button / swipe-back gestures**
- **Scroll locking without layout jumps** (iOS-friendly)
- Keyboard accessibility (**ESC**, **Tab trap**)
- **Focus restoration** to the opener element
- Passing contextual data (**payload**) into modals

The core idea is a **clear separation between modal logic and modal UI**:

- Core handles state, history, focus, and scroll
- Each modal fully controls its own layout and behavior

## Features

- Nested modals (modal stack)
- Back button / gesture closes modals one-by-one
- Scroll lock without scroll jump (iOS-friendly)
- Tab trap only inside the active (top) modal
- Focus restored to the element that opened the modal
- Payload support (open modals with contextual data)
- Fully custom modal UI (no enforced layout)
