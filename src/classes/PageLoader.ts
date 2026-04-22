const PAGE_LOADER_ENTER_DURATION_MS = 420;
const PAGE_LOADER_EXIT_DURATION_MS = 700;

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });

export default class PageLoader {
  private overlay: HTMLElement | null;
  private settleTimeoutId: number | null;
  private prefersReducedMotion: boolean;
  public animatedIn: boolean;

  constructor(overlayElement?: HTMLElement | null) {
    this.overlay = overlayElement ?? document.querySelector<HTMLElement>('.page--overlay');
    this.settleTimeoutId = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animatedIn = true;
    this.overlay?.setAttribute('data-state', 'covering');
  }

  private clearSettleTimeout() {
    if (this.settleTimeoutId !== null) {
      window.clearTimeout(this.settleTimeoutId);
      this.settleTimeoutId = null;
    }
  }

  private wait(duration: number) {
    return new Promise<void>((resolve) => {
      this.settleTimeoutId = window.setTimeout(() => {
        this.settleTimeoutId = null;
        resolve();
      }, duration);
    });
  }

  public async animateIn() {
    if (!this.overlay) {
      return;
    }

    this.clearSettleTimeout();
    this.animatedIn = true;
    this.overlay.setAttribute('data-state', 'pre-enter');
    await waitForNextFrame();

    if (!this.overlay) {
      return;
    }

    this.overlay.setAttribute('data-state', 'covering');
    await this.wait(this.prefersReducedMotion ? 0 : PAGE_LOADER_ENTER_DURATION_MS);
  }

  public showImmediately() {
    if (!this.overlay) {
      return;
    }

    this.clearSettleTimeout();
    this.animatedIn = true;
    this.overlay.setAttribute('data-state', 'covering');
  }

  public async animateOut() {
    if (!this.overlay) {
      return;
    }

    this.clearSettleTimeout();
    this.animatedIn = false;
    this.overlay.setAttribute('data-state', 'revealing');
    await this.wait(this.prefersReducedMotion ? 0 : PAGE_LOADER_EXIT_DURATION_MS);

    if (this.overlay?.getAttribute('data-state') === 'revealing') {
      this.overlay.setAttribute('data-state', 'hidden');
    }
  }

  public destroy() {
    this.clearSettleTimeout();
    this.overlay = null;
  }
}
