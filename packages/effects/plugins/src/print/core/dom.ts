/* DOM helpers and low-level utilities */
export type EventTargetLike =
  | Document
  | HTMLElement
  | null
  | undefined
  | Window;

export function on(
  el: EventTargetLike,
  evt: string,
  handler: EventListenerOrEventListenerObject,
) {
  if (!el) return;
  (el as any).addEventListener?.(evt, handler, false);
}

export function off(
  el: EventTargetLike,
  evt: string,
  handler: EventListenerOrEventListenerObject,
) {
  if (!el) return;
  (el as any).removeEventListener?.(evt, handler, false);
}

export function qsAll(
  sel: string,
  root: Document | HTMLElement = document,
): Element[] {
  try {
    return [...root.querySelectorAll(sel)];
  } catch {
    return [];
  }
}

export function createBaseIframe(id: string, src: string): HTMLIFrameElement {
  const f = document.createElement('iframe');
  f.setAttribute('id', id);
  f.setAttribute('frameborder', '0');
  f.setAttribute('src', src);
  f.setAttribute(
    'style',
    'position:absolute;width:0;height:0;left:-9999px;top:-9999px;border:0;',
  );
  (f as any).setAttribute('allowtransparency', 'true');
  document.body.append(f);
  return f;
}

export function removeNode(el?: HTMLElement | null) {
  if (el && el.parentNode) el.remove();
}

export function setHtmlOverflowHidden(hidden: boolean) {
  const html = document.documentElement;
  if (!html) return;
  html.style.overflow = hidden ? 'hidden' : '';
}
