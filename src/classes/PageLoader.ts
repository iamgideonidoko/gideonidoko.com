import gsap, { Power2, Power4 } from 'gsap';

export default class PageLoader {
  private overlay: HTMLElement | null;
  private loader: HTMLElement | null;
  public animatedIn: boolean;

  constructor() {
    this.overlay = document.querySelector<HTMLElement>('.page--overlay');
    this.loader = this.overlay?.querySelector<HTMLElement>('.page--overlay__loader') ?? null;
    this.animatedIn = true;
  }

  public animateOut() {
    if (this.overlay) {
      this.animatedIn = false;
      gsap.to(this.overlay, { bottom: '100%', ease: Power4.easeInOut, delay: 0.25, duration: 0.6 });
    }
    if (this.loader) {
      gsap.to(this.loader, { y: '-40', opacity: 0, duration: 0.5 });
    }
  }

  public animateOut2() {
    if (this.overlay) {
      this.animatedIn = false;
      gsap.to(this.overlay, { top: '100%', ease: Power4.easeInOut, delay: 0.25, duration: 0.6 });
    }
    if (this.loader) {
      gsap.to(this.loader, { y: '40', opacity: 0, duration: 0.5 });
    }
  }

  public animateIn() {
    if (this.overlay) {
      this.animatedIn = true;
      gsap.fromTo(this.overlay, { top: '100%', bottom: 0 }, { top: 0, ease: Power4.easeInOut, duration: 0 });
    }
    if (this.loader) {
      gsap.fromTo(
        this.loader,
        { y: '40', opacity: 0, delay: 0.3 },
        { y: 0, opacity: 1, delay: 0.6, ease: Power2.easeOut, duration: 0 },
      );
    }
  }
}
