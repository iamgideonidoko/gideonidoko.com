import { gsap } from 'gsap';
import { EventEmitter } from 'events';
import { lerp, getMousePos } from '../helper';

let mouse = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (event) => {
    mouse = getMousePos(event);
  });
}

export default class Cursor extends EventEmitter {
  private filterId: string;
  private bounds: DOMRect;
  private renderedStyles: Record<'tx' | 'ty' | 'radius' | 'stroke', Record<'previous' | 'current' | 'amt', number>>;
  private primitiveValues: {
    turbulence: number;
  };
  private DOM: {
    el: SVGElement;
  } & Partial<Record<'circleInner' | 'feTurbulence', SVGElement>>;
  private onMouseMoveEv: () => void;
  private handleEnter: () => void;
  private handleLeave: () => void;
  private tl?: gsap.core.Timeline;
  private frameId = 0;
  private destroyed = false;

  constructor(el: SVGElement) {
    super();

    this.DOM = { el };
    this.DOM.el.style.opacity = '0';
    this.DOM.circleInner = this.DOM.el.querySelector('.cursor__inner') as SVGElement;
    this.DOM.circleInner.style.fill = 'none';

    this.filterId = '#filter-1';
    this.DOM.feTurbulence = document.querySelector(`${this.filterId} > feTurbulence`) as SVGElement;
    this.primitiveValues = { turbulence: 0 };
    this.bounds = this.DOM.el.getBoundingClientRect();

    this.renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.2 },
      ty: { previous: 0, current: 0, amt: 0.2 },
      radius: { previous: 60, current: 60, amt: 0.2 },
      stroke: { previous: 1, current: 1, amt: 0.2 },
    };

    this.handleEnter = () => this.enter();
    this.handleLeave = () => this.leave();
    this.onMouseMoveEv = () => {
      this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width / 2;
      this.renderedStyles.ty.previous = this.renderedStyles.ty.current = mouse.y - this.bounds.height / 2;
      gsap.to(this.DOM.el, { duration: 0.9, ease: 'Power3.easeOut', opacity: 1 });
      this.frameId = requestAnimationFrame(() => this.render());
      window.removeEventListener('mousemove', this.onMouseMoveEv);
    };

    this.createTimeline();
    this.listen();

    window.addEventListener('mousemove', this.onMouseMoveEv);
  }

  private render() {
    if (this.destroyed) {
      return;
    }

    this.renderedStyles.tx.current = mouse.x - this.bounds.width / 2;
    this.renderedStyles.ty.current = mouse.y - this.bounds.height / 2;

    for (const key in this.renderedStyles) {
      const newKey = key as keyof typeof this.renderedStyles;
      this.renderedStyles[newKey].previous = lerp(
        this.renderedStyles[newKey].previous,
        this.renderedStyles[newKey].current,
        this.renderedStyles[newKey].amt,
      );
    }

    this.DOM.el.style.transform = `translateX(${this.renderedStyles.tx.previous}px) translateY(${this.renderedStyles.ty.previous}px)`;
    this.DOM.circleInner!.setAttribute('r', this.renderedStyles.radius.previous.toString());
    this.DOM.circleInner!.style.strokeWidth = `${this.renderedStyles.stroke.previous}px`;

    this.frameId = requestAnimationFrame(() => this.render());
  }

  private createTimeline() {
    this.tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          this.DOM.circleInner!.style.filter = `url(${this.filterId}`;
        },
        onUpdate: () => {
          this.DOM.feTurbulence!.setAttribute('baseFrequency', this.primitiveValues.turbulence.toString());
        },
        onComplete: () => {
          this.DOM.circleInner!.style.filter = 'none';
        },
      })
      .to(this.primitiveValues, {
        duration: 0.4,
        ease: "rough({ template: none.out, strength: 2, points: 120, taper: 'none', randomize: true, clamp: false})",
        startAt: { turbulence: 0.07 },
        turbulence: 0,
      });
  }

  private enter() {
    this.renderedStyles.radius.current = 40;
    this.renderedStyles.stroke.current = 3;
    this.tl?.restart();
  }

  private leave() {
    this.renderedStyles.radius.current = 60;
    this.renderedStyles.stroke.current = 1;
    this.tl?.progress(1).kill();
  }

  private listen() {
    this.on('enter', this.handleEnter);
    this.on('leave', this.handleLeave);
  }

  public destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('mousemove', this.onMouseMoveEv);
    this.off('enter', this.handleEnter);
    this.off('leave', this.handleLeave);
    this.tl?.kill();
    gsap.killTweensOf(this.DOM.el);
    this.removeAllListeners();
  }
}
