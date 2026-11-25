export const pointer = { x: 0, y: 0, known: false };

if (typeof window !== 'undefined') {
  const storageKey = 'gooey-pointer';
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    sessionStorage.removeItem(storageKey);
    if (
      saved &&
      Date.now() - saved.time < 30000 &&
      saved.width === window.innerWidth &&
      saved.height === window.innerHeight &&
      Number.isFinite(saved.x) &&
      Number.isFinite(saved.y)
    ) {
      pointer.x = saved.x;
      pointer.y = saved.y;
      pointer.known = true;
    }
  } catch {
    // Pointer tracking still works when session storage is unavailable.
  }

  window.addEventListener('pagehide', () => {
    try {
      if (pointer.known) {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            x: pointer.x,
            y: pointer.y,
            width: window.innerWidth,
            height: window.innerHeight,
            time: Date.now(),
          }),
        );
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // Reload recovery is optional when session storage is unavailable.
    }
  });

  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.known = event.pointerType === 'mouse';
  });
  window.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) {
      pointer.known = false;
    }
  });
  window.addEventListener('blur', () => {
    pointer.known = false;
  });
}
